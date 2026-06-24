// ==========================================================================
// AETHER - WISHLIST MULTI-PAGE SCRIPT
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        loadWishlistView();
    }
});

async function loadWishlistView() {
    const container = document.getElementById('wishlist-content-area');
    try {
        const wishlist = await apiFetch(`/wishlist/${currentUser.id_usuario}`);
        renderWishlist(wishlist);
    } catch (err) {
        container.innerHTML = `
            <div class="error-container">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h2>Erro ao carregar lista de desejos</h2>
                <p>${err.message || 'Verifique o status do banco de dados.'}</p>
                <button class="btn btn-secondary" onclick="loadWishlistView()" style="margin-top:20px;">Tentar Novamente</button>
            </div>
        `;
    }
}

function renderWishlist(items) {
    const main = document.getElementById('wishlist-content-area');
    
    if (items.length === 0) {
        main.innerHTML = `
            <div class="wishlist-panel" style="max-width:800px; margin:40px auto; text-align:center; padding:50px;">
                <i class="fa-solid fa-heart" style="font-size:64px; color:var(--border-color); margin-bottom:20px;"></i>
                <h2>Sua lista de desejos está vazia</h2>
                <p style="color:var(--text-muted); margin-bottom:25px;">Navegue pela loja do Aether e adicione jogos que você quer acompanhar aqui.</p>
                <button class="btn btn-primary" onclick="window.location.href='index.html'">Ir à Loja</button>
            </div>
        `;
        return;
    }

    const listHTML = items.map(item => `
        <div class="wishlist-item">
            <div class="wishlist-item-left">
                <div class="wishlist-item-img" style="background-image: url('${item.capa_url}')"></div>
                <div class="wishlist-item-details">
                    <h4 onclick="window.location.href='game.html?id=${item.id_jogo}'" style="cursor:pointer; color:var(--text-white);">${item.titulo}</h4>
                    <p>Desenvolvedor: ${item.desenvolvedor || 'Desconhecido'}</p>
                    <p style="color:var(--blue-primary); font-size:11px;">Salvo em: ${new Date(item.data_adicao).toLocaleDateString('pt-BR')}</p>
                </div>
            </div>
            <div class="wishlist-item-right">
                <span class="wishlist-item-price">${Number(item.preco) === 0 ? 'Grátis' : 'R$ ' + Number(item.preco).toFixed(2)}</span>
                <button class="btn btn-success" onclick="addGameCart(${item.id_jogo}, event)"><i class="fa-solid fa-cart-plus"></i></button>
                <button class="btn btn-danger" onclick="toggleWishlist(${item.id_jogo}, event)" title="Remover da lista"><i class="fa-solid fa-heart-crack"></i></button>
            </div>
        </div>
    `).join('');

    main.innerHTML = `
        <h2 class="section-title"><i class="fa-solid fa-heart"></i> Minha Lista de Desejos</h2>
        <div class="wishlist-panel">
            ${listHTML}
        </div>
    `;
}
