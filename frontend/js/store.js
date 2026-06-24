// ==========================================================================
// AETHER - STORE MULTI-PAGE SCRIPT
// ==========================================================================

let allGamesList = [];
let activeCategory = null;
let searchQuery = '';
let carouselIndex = 0;
let carouselTimer = null;

document.addEventListener('DOMContentLoaded', () => {
    loadCategoriesList();
    loadStoreFeed();

    // Search events
    const searchInput = document.getElementById('game-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
    }
});

async function loadCategoriesList() {
    try {
        const categories = await apiFetch('/categories');
        const container = document.getElementById('header-categories-list');
        if (!container) return;

        // Reset to all
        container.innerHTML = `<span class="category-tag active" id="category-all-tag">Todos os Jogos</span>`;
        
        // Add listener to the default tag
        document.getElementById('category-all-tag').addEventListener('click', (e) => filterByCategory(null, e.target));

        categories.forEach(cat => {
            const span = document.createElement('span');
            span.className = 'category-tag';
            span.textContent = cat.nome_categoria;
            span.addEventListener('click', (e) => filterByCategory(cat.id_categoria, e.target));
            container.appendChild(span);
        });
    } catch (err) {
        console.error('Error loading categories:', err);
    }
}

async function loadStoreFeed() {
    const container = document.getElementById('store-content-area');
    try {
        // Feed endpoint
        const storedUser = localStorage.getItem('aether_user');
        const userId = storedUser ? JSON.parse(storedUser).id_usuario : null;
        const feedUrl = userId ? `/games/feed/home?userId=${userId}` : '/games/feed/home';
        
        const feed = await apiFetch(feedUrl);
        
        // General catalog for search mapping
        allGamesList = await apiFetch('/games');

        renderStore(feed);
    } catch (err) {
        container.innerHTML = `
            <div class="error-container">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h2>Erro ao carregar a loja</h2>
                <p>${err.message || 'Verifique o status do servidor e banco de dados.'}</p>
                <button class="btn btn-secondary" onclick="loadStoreFeed()" style="margin-top:20px;">Tentar Novamente</button>
            </div>
        `;
    }
}

function filterByCategory(categoryId, element) {
    document.querySelectorAll('.category-tag').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    activeCategory = categoryId;
    renderFilteredGames();
}

function handleSearchInput(e) {
    searchQuery = e.target.value.toLowerCase().trim();
    if (searchQuery || activeCategory) {
        renderFilteredGames();
    } else {
        loadStoreFeed(); // Restore home feed
    }
}

function renderFilteredGames() {
    const main = document.getElementById('store-content-area');
    
    let filtered = allGamesList;
    if (activeCategory) {
        filtered = filtered.filter(g => g.id_categoria === activeCategory);
    }
    if (searchQuery) {
        filtered = filtered.filter(g => g.titulo.toLowerCase().includes(searchQuery) || g.descricao.toLowerCase().includes(searchQuery));
    }

    if (carouselTimer) {
        clearInterval(carouselTimer);
        carouselTimer = null;
    }

    main.innerHTML = `
        <div class="store-search-results">
            <h2 class="section-title">Resultados da busca (${filtered.length})</h2>
            ${filtered.length === 0 ? `
                <div class="library-empty-state" style="padding:50px 0;">
                    <i class="fa-solid fa-ghost"></i>
                    <p>Nenhum jogo encontrado com as opções selecionadas.</p>
                </div>
            ` : `
                <div class="games-grid">
                    ${filtered.map(game => renderGameCard(game)).join('')}
                </div>
            `}
        </div>
    `;
}

function renderStore(feed) {
    const main = document.getElementById('store-content-area');
    
    // 1. Featured Slides (Destaques)
    const featuredHTML = feed.destaques && feed.destaques.length > 0 ? `
        <div class="carousel-wrapper">
            ${feed.destaques.map((item, idx) => `
                <div class="carousel-slide ${idx === 0 ? 'active' : ''}" id="slide-${idx}">
                    <div class="carousel-image" onclick="window.location.href='game.html?id=${item.id_jogo}'" style="cursor:pointer;">
                        <img src="${item.banner_url || item.capa_url}" alt="${item.titulo}">
                    </div>
                    <div class="carousel-details">
                        <div onclick="window.location.href='game.html?id=${item.id_jogo}'" style="cursor:pointer;">
                            <h2>${item.titulo}</h2>
                            <p class="carousel-desc">${item.descricao || 'Nenhuma descrição disponível.'}</p>
                            <div class="carousel-grid-thumbs">
                                <div class="carousel-grid-thumb" style="background-image: url('${item.capa_url}')"></div>
                                <div class="carousel-grid-thumb" style="background-image: url('${item.banner_url || item.capa_url}')"></div>
                            </div>
                        </div>
                        <div class="carousel-purchase">
                            <span class="carousel-price">${Number(item.preco) === 0 ? 'Grátis' : 'R$ ' + Number(item.preco).toFixed(2)}</span>
                            <div style="display:flex; gap:10px;">
                                <button class="btn btn-secondary" onclick="toggleWishlist(${item.id_jogo}, event)"><i class="fa-solid fa-heart"></i></button>
                                <button class="btn btn-success" onclick="addGameCart(${item.id_jogo}, event)"><i class="fa-solid fa-cart-plus"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
            <button class="carousel-nav-btn carousel-prev" id="btn-carousel-prev"><i class="fa-solid fa-chevron-left"></i></button>
            <button class="carousel-nav-btn carousel-next" id="btn-carousel-next"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
    ` : '';

    const salesHTML = feed.promocoes && feed.promocoes.length > 0 ? `
        <h2 class="section-title">Ofertas Especiais</h2>
        <div class="games-grid">
            ${feed.promocoes.map(game => renderGameCard(game)).join('')}
        </div>
    ` : '';

    const recommendedHTML = feed.recomendados && feed.recomendados.length > 0 ? `
        <h2 class="section-title">Recomendados para Você</h2>
        <div class="games-grid">
            ${feed.recomendados.map(game => renderGameCard(game)).join('')}
        </div>
    ` : '';

    const recentHTML = feed.recentes && feed.recentes.length > 0 ? `
        <h2 class="section-title">Novidades e Lançamentos</h2>
        <div class="games-grid">
            ${feed.recentes.map(game => renderGameCard(game)).join('')}
        </div>
    ` : '';

    main.innerHTML = `
        ${featuredHTML}
        ${salesHTML}
        ${recommendedHTML}
        ${recentHTML}
    `;

    // Setup carousel navigation bindings
    if (feed.destaques && feed.destaques.length > 1) {
        carouselIndex = 0;
        
        document.getElementById('btn-carousel-prev').addEventListener('click', () => moveCarousel(-1, feed.destaques.length));
        document.getElementById('btn-carousel-next').addEventListener('click', () => moveCarousel(1, feed.destaques.length));
        
        startCarouselAutoPlay(feed.destaques.length);
    }
}

function renderGameCard(game) {
    const isFree = Number(game.preco) === 0;
    return `
        <div class="game-card" onclick="window.location.href='game.html?id=${game.id_jogo}'">
            <div class="game-card-img">
                <img src="${game.capa_url}" alt="${game.titulo}">
                <span class="game-card-category">${game.nome_categoria}</span>
            </div>
            <div class="game-card-info">
                <div>
                    <h3 class="game-card-title">${game.titulo}</h3>
                    <p class="game-card-dev">${game.desenvolvedor || 'Distribuidora Virtual'}</p>
                </div>
                <div class="game-card-footer">
                    <span class="game-card-price">${isFree ? 'Gratuito' : 'R$ ' + Number(game.preco).toFixed(2)}</span>
                    <div class="game-card-actions">
                        <button class="game-card-btn-icon" onclick="toggleWishlist(${game.id_jogo}, event)" title="Desejar">
                            <i class="fa-solid fa-heart"></i>
                        </button>
                        <button class="game-card-btn-icon" onclick="addGameCart(${game.id_jogo}, event)" title="Carrinho">
                            <i class="fa-solid fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function startCarouselAutoPlay(totalSlides) {
    if (carouselTimer) clearInterval(carouselTimer);
    carouselTimer = setInterval(() => {
        moveCarousel(1, totalSlides);
    }, 6000);
}

function moveCarousel(direction, totalSlides) {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;

    slides[carouselIndex].classList.remove('active');
    carouselIndex = (carouselIndex + direction + totalSlides) % totalSlides;
    slides[carouselIndex].classList.add('active');
}
