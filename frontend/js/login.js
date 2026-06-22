// ==========================================================================
// STIM - LOGIN & REGISTER MULTI-PAGE SCRIPT
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Redirection switch links
    const showRegister = document.getElementById('link-show-register');
    const showLogin = document.getElementById('link-show-login');

    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-panel').style.display = 'none';
            document.getElementById('register-panel').style.display = 'block';
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('register-panel').style.display = 'none';
            document.getElementById('login-panel').style.display = 'block';
        });
    }

    // Submit actions
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }
});

async function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error-msg');

    errorEl.style.display = 'none';

    try {
        const user = await apiFetch('/login', {
            method: 'POST',
            body: { email, senha: password }
        });

        // Request full profile data to fetch avatar_url and email
        const profile = await apiFetch(`/users/${user.id_usuario}/profile`);
        currentUser = {
            id_usuario: user.id_usuario,
            nome: user.nome,
            saldo_carteira: user.saldo_carteira,
            email: profile.email,
            avatar_url: profile.avatar_url
        };

        localStorage.setItem('stim_user', JSON.stringify(currentUser));
        updateUserUI();
        alert(`Boas-vindas de volta, ${currentUser.nome}!`);
        window.location.href = 'index.html';
    } catch (err) {
        errorEl.textContent = err.message || 'Credenciais inválidas.';
        errorEl.style.display = 'block';
    }
}

async function handleRegisterSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const errorEl = document.getElementById('register-error-msg');

    errorEl.style.display = 'none';

    try {
        const res = await apiFetch('/register', {
            method: 'POST',
            body: { nome: name, email, senha: password }
        });

        currentUser = {
            id_usuario: res.id_usuario,
            nome: res.nome,
            email: res.email,
            saldo_carteira: 0.00,
            avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${res.nome}`
        };

        localStorage.setItem('stim_user', JSON.stringify(currentUser));
        updateUserUI();
        alert(`Conta criada com sucesso! Boas-vindas, ${currentUser.nome}!`);
        window.location.href = 'index.html';
    } catch (err) {
        errorEl.textContent = err.message || 'Erro ao registrar conta.';
        errorEl.style.display = 'block';
    }
}
