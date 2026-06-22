// ==========================================================================
// STIM - PROFILE MULTI-PAGE SCRIPT
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        loadProfileView();
    }

    // Modal Close
    const closeBtn = document.getElementById('btn-close-deposit-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('deposit-modal').classList.remove('open');
        });
    }

    // Preset Deposits
    document.querySelectorAll('.btn-deposit-val').forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = Number(btn.getAttribute('data-val'));
            simulateDeposit(amount);
        });
    });

    const btn100 = document.getElementById('btn-deposit-100');
    if (btn100) {
        btn100.addEventListener('click', () => simulateDeposit(100));
    }

    // Custom Deposit
    const btnCustom = document.getElementById('btn-deposit-custom-submit');
    if (btnCustom) {
        btnCustom.addEventListener('click', simulateCustomDeposit);
    }
});

async function loadProfileView() {
    const container = document.getElementById('profile-content-area');
    try {
        const profile = await apiFetch(`/users/${currentUser.id_usuario}/profile`);
        const userAchievements = await apiFetch(`/users/${currentUser.id_usuario}/achievements`);
        const friendsList = await apiFetch(`/users/${currentUser.id_usuario}/friends`);

        renderProfile(profile, userAchievements, friendsList);
    } catch (err) {
        container.innerHTML = `
            <div class="error-container">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h2>Erro ao carregar o perfil</h2>
                <p>${err.message || 'Verifique o status do banco de dados.'}</p>
                <button class="btn btn-secondary" onclick="loadProfileView()" style="margin-top:20px;">Tentar Novamente</button>
            </div>
        `;
    }
}

function renderProfile(profile, achievements, friendsList) {
    const main = document.getElementById('profile-content-area');
    const acceptedFriends = friendsList.filter(f => f.status_amizade === 'aceita');

    main.innerHTML = `
        <div class="profile-container">
            <div class="profile-card">
                <div class="profile-main-info">
                    <img class="profile-avatar-large" src="${profile.avatar_url || 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + profile.nome}" alt="Avatar">
                    <div class="profile-texts">
                        <h2>${profile.nome}</h2>
                        <p style="color:var(--blue-primary); font-weight:600; margin-bottom:5px;">ID do Usuário: ${profile.id_usuario}</p>
                        <p>E-mail da Conta: ${profile.email}</p>
                        <p>Registrado desde: ${new Date(profile.data_cadastro).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>
                <div class="profile-wallet-action">
                    <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase;">Saldo da Carteira</div>
                    <div class="balance">R$ ${Number(profile.saldo_carteira).toFixed(2)}</div>
                    <button class="btn btn-primary" id="btn-open-deposit-modal"><i class="fa-solid fa-circle-plus"></i> Adicionar Fundos</button>
                </div>
            </div>

            <div class="profile-stats-grid">
                <div class="profile-stat-box">
                    <div class="profile-stat-number">${profile.total_jogos}</div>
                    <div class="profile-stat-label">Jogos Comprados</div>
                </div>
                <div class="profile-stat-box">
                    <div class="profile-stat-number">${Number(profile.total_horas_jogadas).toFixed(1)}h</div>
                    <div class="profile-stat-label">Horas Jogadas</div>
                </div>
                <div class="profile-stat-box">
                    <div class="profile-stat-number">${profile.total_conquistas}</div>
                    <div class="profile-stat-label">Conquistas</div>
                </div>
                <div class="profile-stat-box">
                    <div class="profile-stat-number">${acceptedFriends.length}</div>
                    <div class="profile-stat-label">Amigos</div>
                </div>
            </div>

            <div class="profile-details-split">
                <div class="profile-reviews-box">
                    <h3 class="section-title" style="margin-top:0;">Minhas Conquistas (${achievements.length})</h3>
                    <div class="achievements-grid" style="grid-template-columns:1fr; max-height: 400px; overflow-y:auto; padding-right:5px;">
                        ${achievements.length === 0 ? '<p style="color:var(--text-muted); font-style:italic;">Nenhuma conquista desbloqueada.</p>' : achievements.map(ach => `
                            <div class="achievement-card">
                                <img class="achievement-icon" src="${ach.icone_url || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + ach.nome_conquista}" alt="Icon">
                                <div class="achievement-info" style="flex-grow:1;">
                                    <span class="achievement-name">${ach.nome_conquista}</span>
                                    <span class="achievement-desc">${ach.descricao || 'Desbloqueada.'}</span>
                                </div>
                                <div style="font-size:10px; color:var(--text-muted); text-align:right;">
                                    Desbloqueada em:<br>${new Date(ach.data_desbloqueio).toLocaleDateString('pt-BR')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="profile-friends-box">
                    <h3 class="section-title" style="margin-top:0;">Amigos Aceitos (${acceptedFriends.length})</h3>
                    <div class="friends-list" style="max-height: 400px; overflow-y:auto; padding-right:5px;">
                        ${acceptedFriends.length === 0 ? '<p style="color:var(--text-muted); font-style:italic;">Nenhum amigo aceito na lista de contatos.</p>' : acceptedFriends.map(f => {
                            const friendName = f.id_usuario === currentUser.id_usuario ? f.nome_amigo : f.nome_usuario;
                            const friendId = f.id_usuario === currentUser.id_usuario ? f.id_amigo : f.id_usuario;
                            return `
                                <div class="friend-row">
                                    <div class="friend-left">
                                        <img class="friend-avatar" src="https://api.dicebear.com/7.x/pixel-art/svg?seed=${friendName}" alt="Avatar">
                                        <div>
                                            <span class="friend-name">${friendName}</span>
                                            <div class="friend-status-text" style="color:var(--blue-primary);">ID: ${friendId}</div>
                                        </div>
                                    </div>
                                    <button class="btn btn-danger friend-btn-mini" onclick="handleFriendAction(${f.id_amizade}, 'delete')">Remover</button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('btn-open-deposit-modal').addEventListener('click', openDepositModal);
}

function openDepositModal() {
    document.getElementById('deposit-modal').classList.add('open');
}

async function simulateDeposit(amount) {
    if (!currentUser) return;
    try {
        const res = await apiFetch(`/users/${currentUser.id_usuario}/deposit`, {
            method: 'POST',
            body: { amount }
        });
        currentUser.saldo_carteira = res.saldo_carteira;
        localStorage.setItem('stim_user', JSON.stringify(currentUser));
        updateUserUI();
        document.getElementById('deposit-modal').classList.remove('open');
        alert(`R$ ${Number(amount).toFixed(2)} depositados com sucesso! Novo saldo: R$ ${Number(res.saldo_carteira).toFixed(2)}`);
        
        loadProfileView(); // Reload stats and profile card
    } catch (err) {
        alert(err.message);
    }
}

function simulateCustomDeposit() {
    const input = document.getElementById('deposit-custom-amount');
    const amount = parseFloat(input.value);
    if (isNaN(amount) || amount <= 0) {
        alert('Valor de depósito inválido.');
        return;
    }
    simulateDeposit(amount);
    input.value = '';
}

async function handleFriendAction(friendshipId, action) {
    if (action === 'delete') {
        if (confirm('Deseja realmente remover esta amizade?')) {
            try {
                await apiFetch(`/friends/${friendshipId}`, { method: 'DELETE' });
                alert('Amizade desfeita.');
                loadProfileView();
            } catch (err) {
                alert(err.message);
            }
        }
    }
}
