// ==========================================================================
// STIM - SHARED COMMON AJAX ENGINE & SESSION MANAGEMENT (MPA)
// ==========================================================================

let currentUser = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    checkServerStatus();
    setInterval(checkServerStatus, 30000); // Check status every 30 seconds
});

// ==========================================================================
// AJAX API CLIENT & CONFIGURATION
// ==========================================================================
const API_BASE = window.location.port !== '3000' ? 'http://localhost:3000/api' : '/api';

async function apiFetch(endpoint, options = {}) {
    const defaultHeaders = { 'Content-Type': 'application/json' };
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };
    
    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        
        let data = {};
        const contentType = response.headers.get('content-type');
        const text = await response.text();
        
        if (contentType && contentType.includes('application/json')) {
            data = text ? JSON.parse(text) : {};
        } else {
            data = { error: text || 'Erro de resposta do servidor (Não JSON)' };
        }
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro na requisição');
        }
        return data;
    } catch (error) {
        console.error(`API Fetch Error [${endpoint}]:`, error);
        throw error;
    }
}

// Server Status Check
async function checkServerStatus() {
    const badge = document.getElementById('status-badge');
    if (!badge) return;
    try {
        const response = await fetch(`${API_BASE}/status`);
        if (response.ok) {
            badge.className = 'status-indicator online';
            badge.querySelector('.status-text').textContent = 'ONLINE';
        } else {
            throw new Error();
        }
    } catch (e) {
        badge.className = 'status-indicator offline';
        badge.querySelector('.status-text').textContent = 'OFFLINE';
    }
}

// ==========================================================================
// SESSION MANAGEMENT
// ==========================================================================
function checkSession() {
    const storedUser = localStorage.getItem('stim_user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUserUI();
        syncCartCount();
    } else {
        currentUser = null;
        updateUserUI();
        
        // Protect pages that require authentication
        const protectedPages = ['library.html', 'profile.html', 'cart.html', 'wishlist.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (protectedPages.includes(currentPage)) {
            window.location.href = 'login.html';
        }
    }
}

async function refreshUserProfile() {
    if (!currentUser) return;
    try {
        const profile = await apiFetch(`/users/${currentUser.id_usuario}/profile`);
        currentUser.saldo_carteira = profile.saldo_carteira;
        currentUser.nome = profile.nome;
        currentUser.avatar_url = profile.avatar_url;
        localStorage.setItem('stim_user', JSON.stringify(currentUser));
        updateUserUI();
    } catch (err) {
        console.error('Failed to refresh user profile:', err);
    }
}

function updateUserUI() {
    const sessionContainer = document.getElementById('session-ui-container');
    const walletWidget = document.getElementById('wallet-balance-widget');
    const walletAmount = document.getElementById('wallet-amount');

    if (!sessionContainer) return;

    if (currentUser) {
        // Show Logged In user profile snippet
        if (walletWidget) {
            walletWidget.style.display = 'flex';
            walletAmount.textContent = `R$ ${Number(currentUser.saldo_carteira).toFixed(2)}`;
        }
        
        sessionContainer.innerHTML = `
            <div class="user-profile-widget" onclick="window.location.href='profile.html'">
                <img class="user-avatar-mini" src="${currentUser.avatar_url || 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + currentUser.nome}" alt="Avatar">
                <span class="user-name-mini">${currentUser.nome}</span>
            </div>
            <button class="btn btn-secondary" onclick="handleLogout()" style="padding: 4px 10px; font-size:12px;">Sair</button>
        `;
    } else {
        // Show Iniciar Sessão trigger
        if (walletWidget) walletWidget.style.display = 'none';
        sessionContainer.innerHTML = `
            <button class="btn btn-login" onclick="window.location.href='login.html'">Iniciar Sessão</button>
        `;
        const cartCount = document.getElementById('cart-count');
        if (cartCount) cartCount.textContent = '0';
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('stim_user');
    window.location.href = 'index.html';
}

async function syncCartCount() {
    if (!currentUser) return;
    try {
        const cartItems = await apiFetch(`/cart/${currentUser.id_usuario}`);
        const cartCount = document.getElementById('cart-count');
        if (cartCount) cartCount.textContent = cartItems.length;
    } catch (err) {
        console.error('Error syncing cart count:', err);
    }
}

// Helpers
function getUrlParam(paramName) {
    const params = new URLSearchParams(window.location.search);
    return params.get(paramName);
}

// Global actions
async function addGameCart(gameId, event) {
    if (event) event.stopPropagation();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        await apiFetch('/cart', {
            method: 'POST',
            body: { userId: currentUser.id_usuario, gameId }
        });
        alert('Jogo adicionado ao seu carrinho!');
        syncCartCount();
    } catch (err) {
        alert(err.message);
    }
}

async function toggleWishlist(gameId, event) {
    if (event) event.stopPropagation();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Fetch current wishlist to check status
        const wishlist = await apiFetch(`/wishlist/${currentUser.id_usuario}`);
        const alreadyExists = wishlist.some(item => item.id_jogo === gameId);

        if (alreadyExists) {
            await apiFetch(`/wishlist/${currentUser.id_usuario}/${gameId}`, { method: 'DELETE' });
            alert('Removido da sua Lista de Desejos!');
        } else {
            await apiFetch('/wishlist', {
                method: 'POST',
                body: { userId: currentUser.id_usuario, gameId }
            });
            alert('Adicionado à sua Lista de Desejos!');
        }

        // If on wishlist page, reload
        if (window.location.pathname.endsWith('wishlist.html')) {
            loadWishlistView();
        }
    } catch (err) {
        alert(err.message);
    }
}
