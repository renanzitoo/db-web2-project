// ==========================================================================
// STIM - GAME DETAILS MULTI-PAGE SCRIPT
// ==========================================================================

let gameDetailsMediaGallery = [];

document.addEventListener('DOMContentLoaded', () => {
    const gameId = getUrlParam('id');
    if (!gameId) {
        window.location.href = 'index.html';
        return;
    }
    loadGameDetails(gameId);
});

async function loadGameDetails(gameId) {
    const container = document.getElementById('game-details-content-area');
    try {
        const details = await apiFetch(`/games/${gameId}/details`);
        renderGameDetails(details);
    } catch (err) {
        container.innerHTML = `
            <div class="error-container">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h2>Erro ao carregar detalhes</h2>
                <p>${err.message || 'Jogo não encontrado ou banco de dados indisponível.'}</p>
                <button class="btn btn-secondary" onclick="window.location.href='index.html'" style="margin-top:20px;">Voltar à Loja</button>
            </div>
        `;
    }
}

function renderGameDetails(details) {
    const main = document.getElementById('game-details-content-area');
    const game = details.game;
    const isFree = Number(game.preco) === 0;

    // Concat screenshots + videos for gallery
    gameDetailsMediaGallery = [];
    if (details.videos && details.videos.length > 0) {
        details.videos.forEach(v => gameDetailsMediaGallery.push({ type: 'video', url: v.video_url }));
    }
    if (details.screenshots && details.screenshots.length > 0) {
        details.screenshots.forEach(s => gameDetailsMediaGallery.push({ type: 'image', url: s.imagem_url }));
    }
    
    // Add default fallbacks if gallery empty
    if (gameDetailsMediaGallery.length === 0) {
        gameDetailsMediaGallery.push({ type: 'image', url: game.banner_url || game.capa_url });
    }

    const mediaListHTML = gameDetailsMediaGallery.map((m, idx) => `
        <div class="media-thumb ${idx === 0 ? 'active' : ''}" onclick="switchGameMedia(${idx})">
            ${m.type === 'video' ? `
                <i class="fa-solid fa-play media-thumb-video-icon"></i>
                <img src="${game.capa_url}">
            ` : `
                <img src="${m.url}">
            `}
        </div>
    `).join('');

    const achievementsHTML = details.achievements && details.achievements.length > 0 ? `
        <div class="details-achievements-box">
            <h3 class="section-title">Conquistas Disponíveis (${details.achievements.length})</h3>
            <div class="achievements-grid">
                ${details.achievements.map(ach => `
                    <div class="achievement-card">
                        <img class="achievement-icon" src="${ach.icone_url || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + ach.nome_conquista}" alt="Ícone">
                        <div class="achievement-info">
                            <span class="achievement-name">${ach.nome_conquista}</span>
                            <span class="achievement-desc">${ach.descricao || 'Desbloqueie jogando.'}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    ` : '';

    const reviewsFeedHTML = details.reviews && details.reviews.length > 0 ? `
        <div class="reviews-feed">
            ${details.reviews.map(rev => `
                <div class="review-item ${rev.recomendaria ? 'recommended' : 'not-recommended'}">
                    <img class="review-author-avatar" src="${rev.avatar_url || 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + rev.nome_usuario}" alt="Avatar">
                    <div class="review-content-col">
                        <div class="review-author-info">
                            <span class="review-author-name">${rev.nome_usuario}</span>
                            <span class="review-recommendation-badge ${rev.recomendaria ? 'up' : 'down'}">
                                <i class="fa-solid ${rev.recomendaria ? 'fa-thumbs-up' : 'fa-thumbs-down'}"></i>
                                ${rev.recomendaria ? 'Recomenda' : 'Não Recomenda'} (Nota: ${rev.nota}/10)
                            </span>
                        </div>
                        <p class="review-comment">${rev.comentario || '<i>Sem comentários escritos.</i>'}</p>
                        <div class="review-date">Postado em: ${new Date(rev.data_avaliacao).toLocaleDateString('pt-BR')}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    ` : '<p style="color:var(--text-muted); font-style:italic;">Nenhuma avaliação postada. Seja o primeiro!</p>';

    main.innerHTML = `
        <div class="details-container">
            <div class="details-header">
                <div class="details-title-row">
                    <h1>${game.titulo}</h1>
                    <button class="btn btn-secondary" onclick="window.location.href='index.html'"><i class="fa-solid fa-chevron-left"></i> Voltar à Loja</button>
                </div>
                <div class="details-meta-tags">
                    <span class="category-tag active">${game.nome_categoria}</span>
                </div>
            </div>

            <div class="details-main-grid">
                <div class="details-media-box">
                    <div class="details-media-display" id="game-media-display-box"></div>
                    <div class="details-media-thumbs">
                        ${mediaListHTML}
                    </div>
                </div>

                <div class="details-sidebar">
                    <div class="details-info-box">
                        <p class="details-description">${game.descricao || 'Sem descrição.'}</p>
                        <div class="details-specs">
                            <div class="details-spec-item">
                                <span class="label">Lançamento</span>
                                <span class="value">${game.data_lancamento ? new Date(game.data_lancamento).toLocaleDateString('pt-BR') : 'Brevemente'}</span>
                            </div>
                            <div class="details-spec-item">
                                <span class="label">Desenvolvedor</span>
                                <span class="value">${game.desenvolvedor || 'Estúdio Desconhecido'}</span>
                            </div>
                            <div class="details-spec-item">
                                <span class="label">Distribuidora</span>
                                <span class="value">${game.distribuidora || 'Independente'}</span>
                            </div>
                        </div>
                    </div>

                    <div class="details-buy-panel">
                        <span class="details-buy-title">Comprar ${game.titulo}</span>
                        <div class="details-price-row">
                            <span style="color:var(--text-muted); font-size:12px;">EDIÇÃO PADRÃO</span>
                            <span class="carousel-price">${isFree ? 'Grátis' : 'R$ ' + Number(game.preco).toFixed(2)}</span>
                        </div>
                        <div class="details-buy-actions">
                            <button class="btn btn-secondary" onclick="toggleWishlist(${game.id_jogo}, event)"><i class="fa-solid fa-heart"></i> Desejos</button>
                            <button class="btn btn-success" onclick="addGameCart(${game.id_jogo}, event)"><i class="fa-solid fa-cart-shopping"></i> + Carrinho</button>
                        </div>
                        <button class="btn btn-primary" onclick="buyGameDirect(${game.id_jogo})" style="font-weight:600;"><i class="fa-solid fa-wallet"></i> Comprar Agora</button>
                    </div>
                </div>
            </div>

            ${achievementsHTML}

            <div class="reviews-section">
                <div class="write-review-card">
                    <h3 class="section-title">Avaliar este jogo</h3>
                    <div id="review-form-container"></div>
                </div>

                <div class="review-list-box">
                    <h3 class="section-title">Avaliações dos Usuários</h3>
                    ${reviewsFeedHTML}
                </div>
            </div>
        </div>
    `;

    // Render review submission form depending on session status
    renderReviewForm(game.id_jogo);

    // Render first slide
    switchGameMedia(0);
}

function renderReviewForm(gameId) {
    const container = document.getElementById('review-form-container');
    if (!container) return;

    if (currentUser) {
        container.innerHTML = `
            <form id="details-review-form">
                <div class="review-options">
                    <div class="form-group" style="margin-bottom:0; width:120px;">
                        <label for="review-score">Nota (1 a 10)</label>
                        <input type="number" id="review-score" min="1" max="10" required value="10" style="padding:6px 10px;">
                    </div>
                    <label class="checkbox-label" style="align-self: flex-end; margin-bottom:10px;">
                        <input type="checkbox" id="review-recommend" checked> Recomendaria este jogo?
                    </label>
                </div>
                <div class="review-input-group">
                    <label for="review-text">Sua Avaliação</label>
                    <textarea id="review-text" required placeholder="O que você achou do jogo? Fale sobre a jogabilidade, história, gráficos..."></textarea>
                </div>
                <div id="details-review-msg" class="success-text" style="display:none;"></div>
                <button type="submit" class="btn btn-primary">Enviar Avaliação</button>
            </form>
        `;

        document.getElementById('details-review-form').addEventListener('submit', (e) => handleReviewSubmit(e, gameId));
    } else {
        container.innerHTML = `<p style="color:var(--text-muted);">Faça <a href="login.html">login</a> para escrever uma avaliação deste produto.</p>`;
    }
}

function getYouTubeEmbedUrl(url) {
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&loop=1&playlist=${match[2]}`;
    }
    return url;
}

function isYouTubeUrl(url) {
    return url.includes('youtube.com') || url.includes('youtu.be');
}

function switchGameMedia(index) {
    const box = document.getElementById('game-media-display-box');
    if (!box || gameDetailsMediaGallery.length === 0) return;

    document.querySelectorAll('.media-thumb').forEach((el, idx) => {
        if (idx === index) el.classList.add('active');
        else el.classList.remove('active');
    });

    const media = gameDetailsMediaGallery[index];
    if (media.type === 'video') {
        if (isYouTubeUrl(media.url)) {
            const embed = getYouTubeEmbedUrl(media.url);
            box.innerHTML = `<iframe src="${embed}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width: 100%; height: 100%; border: none;"></iframe>`;
        } else {
            box.innerHTML = `<video src="${media.url}" autoplay loop muted controls style="width: 100%; height: 100%; object-fit: cover;"></video>`;
        }
    } else {
        box.innerHTML = `<img src="${media.url}" style="width: 100%; height: 100%; object-fit: cover;">`;
    }
}

async function handleReviewSubmit(e, gameId) {
    e.preventDefault();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    const score = Number(document.getElementById('review-score').value);
    const text = document.getElementById('review-text').value;
    const recommend = document.getElementById('review-recommend').checked;
    const msg = document.getElementById('details-review-msg');

    try {
        await apiFetch('/reviews', {
            method: 'POST',
            body: {
                userId: currentUser.id_usuario,
                gameId,
                nota: score,
                comentario: text,
                recomendaria: recommend
            }
        });
        msg.textContent = 'Avaliação enviada com sucesso!';
        msg.style.display = 'block';
        setTimeout(() => {
            msg.style.display = 'none';
            loadGameDetails(gameId); // Reload page state
        }, 1500);
    } catch (err) {
        alert(err.message);
    }
}

async function buyGameDirect(gameId) {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    if (confirm('Deseja realmente comprar este jogo utilizando seu saldo?')) {
        try {
            const res = await apiFetch('/purchase', {
                method: 'POST',
                body: { userId: currentUser.id_usuario, gameId }
            });
            currentUser.saldo_carteira = res.saldo_carteira;
            localStorage.setItem('stim_user', JSON.stringify(currentUser));
            updateUserUI();
            alert('Compra efetuada com sucesso! O jogo foi adicionado à sua biblioteca.');
            window.location.href = 'library.html';
        } catch (err) {
            alert(err.message);
        }
    }
}
