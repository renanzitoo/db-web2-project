const db = require('../config/db');

async function getAchievementsByGameId(gameId) {
  const [rows] = await db.query('SELECT * FROM Conquistas WHERE id_jogo = ? ORDER BY id_conquista DESC', [gameId]);
  return rows;
}

async function getUserAchievements(userId) {
  const [rows] = await db.query(`
    SELECT c.*, uc.data_desbloqueio
    FROM Usuario_Conquistas uc
    INNER JOIN Conquistas c ON c.id_conquista = uc.id_conquista
    WHERE uc.id_usuario = ?
    ORDER BY uc.data_desbloqueio DESC
  `, [userId]);
  return rows;
}

async function getFriendsByUserId(userId) {
  const [rows] = await db.query(`
    SELECT a.*, u.nome AS nome_usuario, f.nome AS nome_amigo
    FROM Amigos a
    INNER JOIN Usuarios u ON u.id_usuario = a.id_usuario
    INNER JOIN Usuarios f ON f.id_usuario = a.id_amigo
    WHERE a.id_usuario = ? OR a.id_amigo = ?
    ORDER BY a.data_solicitacao DESC
  `, [userId, userId]);
  return rows;
}

async function getActivities() {
  const [rows] = await db.query(`
    SELECT atv.*, u.nome AS nome_usuario, j.titulo AS nome_jogo
    FROM Atividades atv
    INNER JOIN Usuarios u ON u.id_usuario = atv.id_usuario
    LEFT JOIN Jogos j ON j.id_jogo = atv.id_jogo
    ORDER BY atv.data_hora DESC
  `);
  return rows;
}

async function getReviewsByGameId(gameId) {
  const [rows] = await db.query(`
    SELECT a.*, u.nome AS nome_usuario
    FROM Avaliacoes a
    INNER JOIN Usuarios u ON u.id_usuario = a.id_usuario
    WHERE a.id_jogo = ?
    ORDER BY a.data_avaliacao DESC
  `, [gameId]);
  return rows;
}

async function createReview({ userId, gameId, nota, comentario, recomendaria }) {
  const [result] = await db.query(`
    INSERT INTO Avaliacoes (id_usuario, id_jogo, nota, comentario, recomendaria, data_avaliacao)
    VALUES (?, ?, ?, ?, ?, NOW())
  `, [userId, gameId, nota, comentario || null, recomendaria ? 1 : 0]);
  return result.insertId;
}

async function upsertFriendRequest({ userId, friendId }) {
  const [result] = await db.query(`
    INSERT INTO Amigos (id_usuario, id_amigo, status_amizade, data_solicitacao)
    VALUES (?, ?, 'pendente', NOW())
  `, [userId, friendId]);
  return result.insertId;
}

async function updateFriendStatus(friendshipId, statusAmizade) {
  if (statusAmizade === 'aceita') {
    await db.query(
      'UPDATE Amigos SET status_amizade = ?, data_aceite = NOW() WHERE id_amizade = ?',
      [statusAmizade, friendshipId]
    );
    return;
  }

  await db.query(
    'UPDATE Amigos SET status_amizade = ?, data_aceite = NULL WHERE id_amizade = ?',
    [statusAmizade, friendshipId]
  );
}

async function deleteFriendship(friendshipId) {
  await db.query('DELETE FROM Amigos WHERE id_amizade = ?', [friendshipId]);
}

module.exports = {
  getAchievementsByGameId,
  getUserAchievements,
  getFriendsByUserId,
  getActivities,
  getReviewsByGameId,
  createReview,
  upsertFriendRequest,
  updateFriendStatus,
  deleteFriendship
};