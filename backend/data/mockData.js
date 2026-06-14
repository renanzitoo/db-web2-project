const users = [
  { id_usuario: 1, nome: 'Alice', email: 'alice@example.com', senha: 'senha', saldo_carteira: 50.00, data_cadastro: '2026-01-01' }
];

const categories = [
  { id_categoria: 1, nome_categoria: 'Ação', descricao: 'Jogos de ação' },
  { id_categoria: 2, nome_categoria: 'RPG', descricao: 'Role-playing games' }
];

const games = [
  { id_jogo: 1, titulo: 'Aventura 1', descricao: 'Jogo de aventura', preco: 19.90, preco_original: 29.90, em_promocao: true, destaque: true, nota_media: 8.7, data_lancamento: '2025-06-01', id_categoria: 1 },
  { id_jogo: 2, titulo: 'RPG Épico', descricao: 'RPG imersivo', preco: 39.90, preco_original: 39.90, em_promocao: false, destaque: true, nota_media: 9.2, data_lancamento: '2024-11-11', id_categoria: 2 },
  { id_jogo: 3, titulo: 'Corrida Turbo', descricao: 'Corridas arcade rápidas', preco: 14.90, preco_original: 24.90, em_promocao: true, destaque: false, nota_media: 7.9, data_lancamento: '2026-02-20', id_categoria: 1 },
  { id_jogo: 4, titulo: 'Cidade Sombria', descricao: 'Ação e exploração em mundo aberto', preco: 59.90, preco_original: 59.90, em_promocao: false, destaque: true, nota_media: 9.5, data_lancamento: '2026-04-08', id_categoria: 2 }
];

const biblioteca = [
  { id_usuario: 1, id_jogo: 2, data_aquisicao: '2026-05-01', horas_jogadas: 24.5 }
];

const achievements = [
  { id_conquista: 1, id_jogo: 1, nome_conquista: 'Primeiro Passo', descricao: 'Complete o tutorial', pontos: 10, data_criacao: '2026-01-01' },
  { id_conquista: 2, id_jogo: 2, nome_conquista: 'Mestre do Reino', descricao: 'Derrote o chefe final', pontos: 50, data_criacao: '2026-01-01' },
  { id_conquista: 3, id_jogo: 4, nome_conquista: 'Explorador Noturno', descricao: 'Descubra a área secreta', pontos: 30, data_criacao: '2026-01-01' }
];

const userAchievements = [
  { id_usuario: 1, id_conquista: 2, data_desbloqueio: '2026-05-02T18:30:00' }
];

const friends = [
  { id_amizade: 1, id_usuario: 1, id_amigo: 2, status_amizade: 'aceita', data_solicitacao: '2026-05-01T12:00:00', data_aceite: '2026-05-01T13:00:00' },
  { id_amizade: 2, id_usuario: 1, id_amigo: 3, status_amizade: 'pendente', data_solicitacao: '2026-06-10T09:15:00', data_aceite: null }
];

const activities = [
  { id_atividade: 1, id_usuario: 1, id_jogo: 2, tipo_atividade: 'jogou', descricao: 'Alice jogou RPG Épico por 2 horas', visibilidade: 'amigos', data_hora: '2026-06-13T20:10:00' },
  { id_atividade: 2, id_usuario: 1, id_jogo: 1, tipo_atividade: 'comprou', descricao: 'Alice comprou Aventura 1', visibilidade: 'publica', data_hora: '2026-06-12T15:00:00' }
];

const reviews = [
  { id_avaliacao: 1, id_usuario: 1, id_jogo: 2, nota: 9, comentario: 'Ótimo RPG, história muito boa.', recomendaria: true, data_avaliacao: '2026-05-03T19:00:00' }
];

function nextUserId() {
  return users.length ? users[users.length - 1].id_usuario + 1 : 1;
}

module.exports = {
  users,
  categories,
  games,
  biblioteca,
  achievements,
  userAchievements,
  friends,
  activities,
  reviews,
  nextUserId
};