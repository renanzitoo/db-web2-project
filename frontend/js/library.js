// ==========================================================================
// AETHER - LIBRARY MULTI-PAGE SCRIPT
// ==========================================================================

let userLibraryGames = [];
let selectedLibraryGameId = null;

document.addEventListener('DOMContentLoaded', () => {
    // Session check is handled by common.js, which redirects if not logged in.
    if (currentUser) {
        loadLibrary();
    }
});

async function loadLibrary() {
    const container = document.getElementById('library-content-area');
    try {
        const list = await apiFetch(`/library/${currentUser.id_usuario}`);
        userLibraryGames = list;
        renderLibrary(list);
    } catch (err) {
        container.innerHTML = `
            <div class="error-container">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h2>Erro ao carregar biblioteca</h2>
                <p>${err.message || 'Verifique o status do banco de dados.'}</p>
                <button class="btn btn-secondary" onclick="loadLibrary()" style="margin-top:20px;">Tentar Novamente</button>
            </div>
        `;
    }
}

function renderLibrary(libraryGames) {
    const main = document.getElementById('library-content-area');
    
    if (libraryGames.length === 0) {
        main.innerHTML = `
            <div class="library-layout">
                <div class="library-sidebar">
                    <div class="library-sidebar-header">
                        <h3>MEUS JOGOS (0)</h3>
                    </div>
                    <div class="library-games-list"></div>
                </div>
                <div class="library-main">
                    <div class="library-empty-state">
                        <i class="fa-solid fa-gamepad"></i>
                        <p>Você não possui jogos na sua biblioteca ainda.</p>
                        <button class="btn btn-primary" onclick="window.location.href='index.html'">Ir para Loja</button>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    const listHTML = libraryGames.map(item => `
        <div class="library-game-item ${selectedLibraryGameId === item.id_jogo ? 'active' : ''}" data-id="${item.id_jogo}">
            <div class="library-game-icon" style="background-image: url('${item.capa_url}')"></div>
            <span class="library-game-name">${item.titulo}</span>
        </div>
    `).join('');

    main.innerHTML = `
        <div class="library-layout">
            <div class="library-sidebar">
                <div class="library-sidebar-header">
                    <h3>MEUS JOGOS (${libraryGames.length})</h3>
                </div>
                <div class="library-games-list" id="library-sidebar-list">
                    ${listHTML}
                </div>
            </div>
            <div class="library-main" id="library-main-panel">
                <div class="library-empty-state">
                    <i class="fa-solid fa-hand-pointer"></i>
                    <p>Selecione um jogo da barra lateral para começar a jogar.</p>
                </div>
            </div>
        </div>
    `;

    // Bind sidebar clicks
    document.querySelectorAll('.library-game-item').forEach(el => {
        el.addEventListener('click', (e) => {
            const id = Number(el.getAttribute('data-id'));
            selectLibraryGame(id, el);
        });
    });

    // Auto-select first game
    if (selectedLibraryGameId) {
        const exists = libraryGames.some(g => g.id_jogo === selectedLibraryGameId);
        const targetId = exists ? selectedLibraryGameId : libraryGames[0].id_jogo;
        const targetEl = document.querySelector(`.library-game-item[data-id="${targetId}"]`);
        selectLibraryGame(targetId, targetEl);
    } else {
        const targetId = libraryGames[0].id_jogo;
        const targetEl = document.querySelector(`.library-game-item[data-id="${targetId}"]`);
        selectLibraryGame(targetId, targetEl);
    }
}

async function selectLibraryGame(gameId, element) {
    selectedLibraryGameId = gameId;
    const panel = document.getElementById('library-main-panel');
    const game = userLibraryGames.find(g => g.id_jogo === gameId);

    // Style sidebar highlight
    document.querySelectorAll('.library-game-item').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');

    panel.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
        </div>
    `;

    try {
        const details = await apiFetch(`/games/${gameId}/details`);
        const userAchievements = await apiFetch(`/users/${currentUser.id_usuario}/achievements`);
        
        // Filter userAchievements matching this game
        const gameAchievementsIds = details.achievements.map(a => a.id_conquista);
        const unlockedGameAchievements = userAchievements.filter(ua => gameAchievementsIds.includes(ua.id_conquista));
        const unlockedIds = unlockedGameAchievements.map(a => a.id_conquista);

        const totalAchievementsCount = details.achievements.length;
        const unlockedCount = unlockedGameAchievements.length;
        const percent = totalAchievementsCount > 0 ? Math.round((unlockedCount / totalAchievementsCount) * 100) : 0;

        panel.innerHTML = `
            <div class="library-banner-area" style="background-image: url('${game.banner_url || game.capa_url}')">
                <div class="library-banner-overlay"></div>
                <div class="library-banner-info">
                    <h2>${game.titulo}</h2>
                    <div class="play-action-row">
                        <button class="btn btn-play" id="btn-play-game"><i class="fa-solid fa-play"></i> JOGAR</button>
                        <div class="play-hours">
                            <span class="label">TEMPO DE JOGO</span>
                            <span class="value">${Number(game.horas_jogadas).toFixed(1)} horas</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="library-body-content">
                <div class="library-achievements-panel">
                    <h3 class="section-title" style="margin-top:0;">CONQUISTAS (${unlockedCount}/${totalAchievementsCount})</h3>
                    ${totalAchievementsCount > 0 ? `
                        <div style="display:flex; justify-content:space-between; font-size:12px; color:var(--text-muted);">
                            <span>Progresso do Jogo</span>
                            <span>${percent}%</span>
                        </div>
                        <div class="achievements-progress-bar">
                            <div class="achievements-progress-fill" style="width: ${percent}%;"></div>
                        </div>
                        <div class="achievements-grid">
                            ${details.achievements.map(ach => {
                                const isUnlocked = unlockedIds.includes(ach.id_conquista);
                                return `
                                    <div class="achievement-card" style="opacity: ${isUnlocked ? '1' : '0.45'}">
                                        <img class="achievement-icon" src="${ach.icone_url || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + ach.nome_conquista}" alt="Icon">
                                        <div class="achievement-info">
                                            <span class="achievement-name">${ach.nome_conquista} ${isUnlocked ? '<i class="fa-solid fa-lock-open" style="color:#00ff00; font-size:10px; margin-left:5px;"></i>' : '<i class="fa-solid fa-lock" style="font-size:10px; margin-left:5px;"></i>'}</span>
                                            <span class="achievement-desc">${ach.descricao || 'Desbloqueável.'}</span>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : '<p style="color:var(--text-muted); font-style:italic;">Este jogo não possui conquistas suportadas.</p>'}
                </div>

                <div class="library-details-right">
                    <div class="library-game-activity">
                        <h4 style="margin-bottom:10px; border-bottom:1px solid var(--border-color); padding-bottom:5px;">DETALHES DO PRODUTO</h4>
                        <p style="font-size:13px; margin-bottom:8px;"><strong style="color:var(--text-muted);">Desenvolvedora:</strong> ${game.desenvolvedor || 'Estúdio Desconhecido'}</p>
                        <p style="font-size:13px; margin-bottom:8px;"><strong style="color:var(--text-muted);">Adquirido em:</strong> ${new Date(game.data_aquisicao).toLocaleDateString('pt-BR')}</p>
                        <button class="btn btn-secondary btn-block" onclick="window.location.href='game.html?id=${game.id_jogo}'"><i class="fa-solid fa-circle-info"></i> Ver Página na Loja</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('btn-play-game').addEventListener('click', () => playSimulator(gameId));
    } catch (err) {
        panel.innerHTML = `<div class="error-container"><p>Erro ao carregar detalhes do jogo selecionado.</p></div>`;
    }
}

async function playSimulator(gameId) {
    if (!currentUser) return;
    try {
        const result = await apiFetch(`/library/${currentUser.id_usuario}/play/${gameId}`, { method: 'POST' });
        
        // Update local hour
        const game = userLibraryGames.find(g => g.id_jogo === gameId);
        if (game) {
            game.horas_jogadas = result.totalHours;
        }

        let msg = `Você jogou por mais ${result.hoursAdded} horas!`;
        if (result.unlockedAchievement) {
            msg += `\n\n🏆 PARABÉNS! Você desbloqueou a conquista: "${result.unlockedAchievement}"!`;
        }
        alert(msg);

        // Refresh selected game panel
        const activeEl = document.querySelector(`.library-game-item[data-id="${gameId}"]`);
        selectLibraryGame(gameId, activeEl);
    } catch (err) {
        alert(err.message);
    }
}
