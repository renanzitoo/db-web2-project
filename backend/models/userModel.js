const db = require('../config/db');
const { mapUserMedia } = require('../utils/media');

async function findUserByEmail(email) {
  const [rows] = await db.query('SELECT * FROM Usuarios WHERE email = ? LIMIT 1', [email]);
  return mapUserMedia(rows[0] || null);
}

async function findUserById(userId) {
  const [rows] = await db.query('SELECT * FROM Usuarios WHERE id_usuario = ? LIMIT 1', [userId]);
  return mapUserMedia(rows[0] || null);
}

async function createUser({ nome, email, senha }) {
  const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(nome)}`;
  const [result] = await db.query(
    'INSERT INTO Usuarios (nome, email, senha, avatar_url, saldo_carteira, data_cadastro) VALUES (?, ?, ?, ?, 0.00, CURDATE())',
    [nome, email, senha, avatarUrl]
  );

  return findUserById(result.insertId);
}

async function updateUserBalance(userId, saldoCarteira) {
  await db.query('UPDATE Usuarios SET saldo_carteira = ? WHERE id_usuario = ?', [saldoCarteira, userId]);
  return findUserById(userId);
}

async function findUserProfile(userId) {
  const [rows] = await db.query(`
    SELECT
      u.*,
      (SELECT COUNT(*) FROM Biblioteca b WHERE b.id_usuario = u.id_usuario) AS total_jogos,
      (SELECT COALESCE(SUM(b.horas_jogadas), 0) FROM Biblioteca b WHERE b.id_usuario = u.id_usuario) AS total_horas_jogadas,
      (SELECT COUNT(*) FROM Usuario_Conquistas uc WHERE uc.id_usuario = u.id_usuario) AS total_conquistas,
      (SELECT COUNT(*) FROM Amigos a WHERE (a.id_usuario = u.id_usuario OR a.id_amigo = u.id_usuario) AND a.status_amizade = 'aceita') AS total_amigos,
      (SELECT COUNT(*) FROM Avaliacoes av WHERE av.id_usuario = u.id_usuario) AS total_avaliacoes
    FROM Usuarios u
    WHERE u.id_usuario = ?
    LIMIT 1
  `, [userId]);

  return mapUserMedia(rows[0] || null);
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserBalance,
  findUserProfile
};