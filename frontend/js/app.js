document.addEventListener('DOMContentLoaded', () => {
  const gamesList = document.getElementById('gamesList');
  const libraryList = document.getElementById('libraryList');
  const userDisplay = document.getElementById('userDisplay');
  const btnShowLogin = document.getElementById('btnShowLogin');
  const btnLogout = document.getElementById('btnLogout');
  const saldoValue = document.getElementById('saldoValue');
  const accountName = document.getElementById('accountName');

  // view elements
  const storeView = document.getElementById('storeView');
  const libraryView = document.getElementById('libraryView');
  const accountView = document.getElementById('accountView');

  // auth forms
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  let currentUser = null;

  function setUser(u) {
    currentUser = u;
    if (u) {
      userDisplay.textContent = u.nome;
      accountName.textContent = u.nome;
      saldoValue.textContent = (u.saldo_carteira || 0).toFixed(2);
      btnLogout.classList.remove('d-none');
    } else {
      userDisplay.textContent = 'Convidado';
      saldoValue.textContent = '0.00';
      accountName.textContent = '—';
      btnLogout.classList.add('d-none');
      libraryList.innerHTML = '';
    }
  }

  async function loadGames() {
    try {
      const res = await fetch('/api/games');
      const games = await res.json();
      gamesList.innerHTML = '';
      games.forEach(g => {
        const col = document.createElement('div');
        col.className = 'col-md-6';
        col.innerHTML = `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${g.titulo}</h5>
              <p class="card-text">${g.descricao}</p>
              <p class="mb-1"><strong>Preço:</strong> R$ ${g.preco.toFixed(2)}</p>
              <button class="btn btn-sm btn-success btn-purchase" data-id="${g.id_jogo}">Comprar</button>
            </div>
          </div>
        `;
        gamesList.appendChild(col);
      });
      // attach purchase handlers
      document.querySelectorAll('.btn-purchase').forEach(btn => {
        btn.addEventListener('click', async (ev) => {
          const gameId = ev.currentTarget.dataset.id;
          if (!currentUser) return alert('Faça login para comprar');
          try {
            const res = await fetch('/api/purchase', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: currentUser.id_usuario, gameId })
            });
            const j = await res.json();
            if (!res.ok) return alert(j.error || 'Erro na compra');
            alert('Compra realizada com sucesso');
            // atualizar saldo e biblioteca
            currentUser.saldo_carteira = j.saldo_carteira;
            setUser(currentUser);
            await loadLibrary(currentUser.id_usuario);
          } catch (err) {
            console.error(err);
            alert('Erro ao comprar');
          }
        });
      });
    } catch (err) {
      console.error('Erro ao carregar games', err);
    }
  }

  async function loadLibrary(userId) {
    try {
      const res = await fetch(`/api/library/${userId}`);
      const owned = await res.json();
      libraryList.innerHTML = '';
      owned.forEach(g => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${g.titulo} — R$ ${g.preco.toFixed(2)}`;
        libraryList.appendChild(li);
      });
    } catch (err) {
      console.error('Erro ao carregar biblioteca', err);
    }
  }

  // Auth
  loginForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value.trim();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      const j = await res.json();
      if (!res.ok) return alert(j.error || 'Falha no login');
      setUser(j);
      if (j.id_usuario) await loadLibrary(j.id_usuario);
    } catch (err) {
      console.error(err);
    }
  });

  registerForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const nome = document.getElementById('regNome').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const senha = document.getElementById('regSenha').value.trim();
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });
      const j = await res.json();
      if (!res.ok) return alert(j.error || 'Erro no registro');
      alert('Registrado com sucesso — faça login');
    } catch (err) {
      console.error(err);
    }
  });

  btnLogout.addEventListener('click', () => {
    setUser(null);
  });

  // show auth modal using Bootstrap
  let authModal = null;
  try {
    authModal = new bootstrap.Modal(document.getElementById('authModal'));
  } catch (e) {
    // bootstrap not available
  }
  btnShowLogin.addEventListener('click', () => {
    if (authModal) authModal.show();
  });

  // navigation
  document.querySelectorAll('.nav-link[data-view]').forEach(a => {
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      const view = a.dataset.view;
      showView(view);
      document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
      a.classList.add('active');
    });
  });

  function showView(name) {
    storeView.classList.toggle('d-none', name !== 'store');
    libraryView.classList.toggle('d-none', name !== 'library');
    accountView.classList.toggle('d-none', name !== 'account');
    if (name === 'library' && currentUser) loadLibrary(currentUser.id_usuario);
  }

  // inicial
  setUser(null);
  loadGames();
  showView('store');
});
