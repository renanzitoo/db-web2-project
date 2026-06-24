// ==========================================================================
// AETHER - CART MULTI-PAGE SCRIPT
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        loadCartView();
    }
});

async function loadCartView() {
    const container = document.getElementById('cart-content-area');
    try {
        const cartItems = await apiFetch(`/cart/${currentUser.id_usuario}`);
        renderCart(cartItems);
    } catch (err) {
        container.innerHTML = `
            <div class="error-container">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h2>Erro ao carregar o carrinho</h2>
                <p>${err.message || 'Verifique o status do banco de dados.'}</p>
                <button class="btn btn-secondary" onclick="loadCartView()" style="margin-top:20px;">Tentar Novamente</button>
            </div>
        `;
    }
}

function renderCart(cartItems) {
    const main = document.getElementById('cart-content-area');
    
    if (cartItems.length === 0) {
        main.innerHTML = `
            <div class="cart-items-panel" style="max-width:800px; margin: 40px auto; text-align:center; padding: 50px;">
                <i class="fa-solid fa-cart-shopping" style="font-size:64px; color:var(--border-color); margin-bottom:20px;"></i>
                <h2>Seu carrinho está vazio</h2>
                <p style="color:var(--text-muted); margin-bottom:25px;">Parece que você ainda não adicionou nenhum jogo ao seu carrinho de compras.</p>
                <button class="btn btn-primary" onclick="window.location.href='index.html'">Explorar a Loja</button>
            </div>
        `;
        return;
    }

    const subtotal = cartItems.reduce((acc, item) => acc + Number(item.preco), 0);

    const itemsHTML = cartItems.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-img" style="background-image: url('${item.capa_url}')"></div>
                <div class="cart-item-details">
                    <h4 onclick="window.location.href='game.html?id=${item.id_jogo}'" style="cursor:pointer;">${item.titulo}</h4>
                    <span>${item.nome_categoria}</span>
                </div>
            </div>
            <div class="cart-item-right">
                <span class="cart-item-price">${Number(item.preco) === 0 ? 'Grátis' : 'R$ ' + Number(item.preco).toFixed(2)}</span>
                <button class="btn-remove-cart" onclick="removeCartItem(${item.id_jogo})" title="Remover item"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
    `).join('');

    main.innerHTML = `
        <h2 class="section-title"><i class="fa-solid fa-cart-shopping"></i> Seu Carrinho de Compras</h2>
        <div class="cart-layout-grid">
            <div class="cart-items-panel">
                ${itemsHTML}
                <div style="margin-top:20px; display:flex; justify-content:space-between; align-items:center;">
                    <button class="btn btn-secondary" onclick="window.location.href='index.html'"><i class="fa-solid fa-arrow-left"></i> Continuar Comprando</button>
                </div>
            </div>

            <div class="cart-summary-panel">
                <h3 style="margin-bottom:20px; border-bottom:1px solid var(--border-color); padding-bottom:8px; color:var(--text-white);">Resumo da Compra</h3>
                <div class="cart-summary-row">
                    <span>Itens (${cartItems.length})</span>
                    <span>R$ ${subtotal.toFixed(2)}</span>
                </div>
                <div class="cart-summary-row total">
                    <span>Subtotal</span>
                    <span>R$ ${subtotal.toFixed(2)}</span>
                </div>
                <p style="font-size:11px; color:var(--text-muted); margin-bottom:20px;">Você pagará usando o seu saldo da carteira virtual do Aether. A transação é imediata.</p>
                <button class="btn btn-success btn-block" id="btn-cart-checkout"><i class="fa-solid fa-circle-check"></i> Finalizar Compra</button>
            </div>
        </div>
    `;

    document.getElementById('btn-cart-checkout').addEventListener('click', checkoutCart);
}

async function removeCartItem(gameId) {
    try {
        await apiFetch(`/cart/${currentUser.id_usuario}/${gameId}`, { method: 'DELETE' });
        syncCartCount();
        loadCartView();
    } catch (err) {
        alert(err.message);
    }
}

async function checkoutCart() {
    if (confirm('Confirma a compra de todos os itens do carrinho?')) {
        try {
            const res = await apiFetch(`/cart/${currentUser.id_usuario}/checkout`, { method: 'POST' });
            currentUser.saldo_carteira = res.saldo_carteira;
            localStorage.setItem('aether_user', JSON.stringify(currentUser));
            updateUserUI();
            syncCartCount();
            alert('Compra finalizada com sucesso! Todos os jogos foram adicionados à sua biblioteca.');
            window.location.href = 'library.html';
        } catch (err) {
            alert(err.message);
        }
    }
}
