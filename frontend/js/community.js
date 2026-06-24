// ==========================================================================
// AETHER - COMMUNITY MULTI-PAGE SCRIPT
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    loadCommunityView();

    // Bind modal close
    const closeBtn = document.getElementById('btn-close-friend-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('friend-modal').classList.remove('open');
        });
    }

    const form = document.getElementById('friend-form');
    if (form) {
        form.addEventListener('submit', handleFriendRequestSubmit);
    }
});

async function loadCommunityView() {
    const container = document.getElementById('community-content-area');
    try {
        const activities = await apiFetch('/activity');
        const friends = currentUser ? await apiFetch(`/users/${currentUser.id_usuario}/friends`) : [];
        renderCommunity(activities, friends);
    } catch (err) {
        container.innerHTML = `
            <div class="error-container">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h2>Erro ao carregar a comunidade</h2>
                <p>${err.message || 'Verifique o status do banco de dados.'}</p>
                <button class="btn btn-secondary" onclick="loadCommunityView()" style="margin-top:20px;">Tentar Novamente</button>
            </div>
        `;
    }
}

function renderCommunity(activities, friendsList) {
    const main = document.getElementById('community-content-area');
    
    // Sort activities by date
    const feedHTML = activities.map(act => `
        <div class="activity-item">
            <img class="activity-avatar" src="${act.avatar_url || 'https://api.dicebear.com/7.x/pixel-art/svg?seed=' + act.nome_usuario}" alt="Avatar">
            <div class="activity-content">
                <div class="activity-header">
                    <strong>${act.nome_usuario}</strong> postou uma atividade
                </div>
                <div style="font-size:14px; margin-bottom:10px; color:var(--text-white);">
                    ${act.descricao}
                </div>
                ${act.id_jogo ? `
                    <div class="activity-game-info" onclick="window.location.href='game.html?id=${act.id_jogo}'" style="cursor:pointer;">
                        <span class="activity-game-title">${act.nome_jogo || 'Ver Jogo'}</span>
                    </div>
                ` : ''}
                <div class="activity-time">${new Date(act.data_hora).toLocaleString('pt-BR')}</div>
            </div>
        </div>
    `).join('');

    let pendingRequestsHTML = '';
    let acceptedFriendsHTML = '';

    if (currentUser) {
        const pending = friendsList.filter(f => f.status_amizade === 'pendente');
        const accepted = friendsList.filter(f => f.status_amizade === 'aceita');

        pendingRequestsHTML = pending.map(f => {
            const isSender = f.id_usuario === currentUser.id_usuario;
            const friendName = isSender ? f.nome_amigo : f.nome_usuario;
            return `
                <div class="friend-row">
                    <div class="friend-left">
                        <img class="friend-avatar" src="https://api.dicebear.com/7.x/pixel-art/svg?seed=${friendName}" alt="Avatar">
                        <div>
                            <span class="friend-name">${friendName}</span>
                            <div class="friend-status-text">${isSender ? 'Solicitação Enviada' : 'Enviou solicitação'}</div>
                        </div>
                    </div>
                    ${isSender ? `
                        <button class="btn btn-danger friend-btn-mini" onclick="handleFriendAction(${f.id_amizade}, 'delete')">Cancelar</button>
                    ` : `
                        <div class="friend-actions">
                            <button class="btn btn-success friend-btn-mini" onclick="handleFriendAction(${f.id_amizade}, 'accept')"><i class="fa-solid fa-check"></i></button>
                            <button class="btn btn-danger friend-btn-mini" onclick="handleFriendAction(${f.id_amizade}, 'delete')"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                    `}
                </div>
            `;
        }).join('');

        acceptedFriendsHTML = accepted.map(f => {
            const friendName = f.id_usuario === currentUser.id_usuario ? f.nome_amigo : f.nome_usuario;
            return `
                <div class="friend-row">
                    <div class="friend-left">
                        <img class="friend-avatar" src="https://api.dicebear.com/7.x/pixel-art/svg?seed=${friendName}" alt="Avatar">
                        <div>
                            <span class="friend-name">${friendName}</span>
                            <div class="friend-status-text" style="color:#00ff00;">Amigos <i class="fa-solid fa-circle" style="font-size:6px; margin-left:3px;"></i></div>
                        </div>
                    </div>
                    <button class="btn btn-secondary friend-btn-mini" onclick="handleFriendAction(${f.id_amizade}, 'delete')">Remover</button>
                </div>
            `;
        }).join('');
    }

    main.innerHTML = `
        <div class="community-layout">
            <div>
                <h2 class="section-title"><i class="fa-solid fa-users"></i> Atividade da Comunidade</h2>
                <div class="activity-feed-panel">
                    ${activities.length === 0 ? '<p style="color:var(--text-muted);">Nenhuma atividade registrada na rede social ainda.</p>' : feedHTML}
                </div>
            </div>

            <div class="social-friends-panel">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 style="color:var(--text-white); font-size:16px;">MINHA REDE</h3>
                    ${currentUser ? `<button class="btn btn-primary" id="btn-open-friend-modal" style="font-size:12px; padding:4px 10px;"><i class="fa-solid fa-user-plus"></i> Convidar</button>` : ''}
                </div>
                
                ${currentUser ? `
                    <div>
                        <div class="friends-section-title">SOLICITAÇÕES DE AMIZADE</div>
                        <div class="friends-list" style="margin-top:10px;">
                            ${pendingRequestsHTML || '<p style="color:var(--text-muted); font-size:12px; font-style:italic;">Nenhuma pendência.</p>'}
                        </div>
                    </div>

                    <div>
                        <div class="friends-section-title">AMIGOS ACEITOS</div>
                        <div class="friends-list" style="margin-top:10px;">
                            ${acceptedFriendsHTML || '<p style="color:var(--text-muted); font-size:12px; font-style:italic;">Você ainda não possui amigos na lista.</p>'}
                        </div>
                    </div>
                ` : `
                    <p style="color:var(--text-muted); text-align:center; padding: 20px 0;">Faça <a href="login.html">login</a> para visualizar e gerenciar seus amigos.</p>
                `}
            </div>
        </div>
    `;

    // Bind modal open
    const openBtn = document.getElementById('btn-open-friend-modal');
    if (openBtn) {
        openBtn.addEventListener('click', openFriendModal);
    }
}

async function handleFriendAction(friendshipId, action) {
    try {
        if (action === 'accept') {
            await apiFetch(`/friends/${friendshipId}`, {
                method: 'PATCH',
                body: { status_amizade: 'aceita' }
            });
            alert('Convite de amizade aceito!');
        } else if (action === 'delete') {
            if (confirm('Deseja cancelar/remover esta amizade?')) {
                await apiFetch(`/friends/${friendshipId}`, { method: 'DELETE' });
                alert('Amizade desfeita/cancelada.');
            } else {
                return;
            }
        }
        loadCommunityView();
    } catch (err) {
        alert(err.message);
    }
}

function openFriendModal() {
    document.getElementById('friend-error-msg').style.display = 'none';
    document.getElementById('friend-success-msg').style.display = 'none';
    document.getElementById('friend-modal').classList.add('open');
}

async function handleFriendRequestSubmit(e) {
    e.preventDefault();
    if (!currentUser) return;
    const friendId = Number(document.getElementById('friend-id-input').value);
    const errorEl = document.getElementById('friend-error-msg');
    const successEl = document.getElementById('friend-success-msg');

    errorEl.style.display = 'none';
    successEl.style.display = 'none';

    if (friendId === currentUser.id_usuario) {
        errorEl.textContent = 'Você não pode adicionar a si mesmo.';
        errorEl.style.display = 'block';
        return;
    }

    try {
        await apiFetch('/friends', {
            method: 'POST',
            body: { userId: currentUser.id_usuario, friendId }
        });
        successEl.textContent = 'Solicitação de amizade enviada com sucesso!';
        successEl.style.display = 'block';
        setTimeout(() => {
            document.getElementById('friend-modal').classList.remove('open');
            loadCommunityView();
        }, 1500);
    } catch (err) {
        errorEl.textContent = err.message || 'ID do amigo inválido ou já existe relação.';
        errorEl.style.display = 'block';
    }
}
