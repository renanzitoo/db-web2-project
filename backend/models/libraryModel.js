const db = require('../config/db');

async function getLibraryByUserId(userId) {
  const [rows] = await db.query(`
    SELECT j.*, b.data_aquisicao, b.horas_jogadas, c.nome_categoria, c.descricao AS categoria_descricao
    FROM Biblioteca b
    INNER JOIN Jogos j ON j.id_jogo = b.id_jogo
    INNER JOIN Categorias c ON c.id_categoria = j.id_categoria
    WHERE b.id_usuario = ?
    ORDER BY b.data_aquisicao DESC
  `, [userId]);

  return rows;
}

async function hasGame(userId, gameId) {
  const [rows] = await db.query(
    'SELECT 1 FROM Biblioteca WHERE id_usuario = ? AND id_jogo = ? LIMIT 1',
    [userId, gameId]
  );
  return rows.length > 0;
}

async function addGameToLibrary(userId, gameId) {
  await db.query(
    'INSERT INTO Biblioteca (id_usuario, id_jogo, data_aquisicao, horas_jogadas) VALUES (?, ?, CURDATE(), 0.00)',
    [userId, gameId]
  );
}

module.exports = {
  getLibraryByUserId,
  hasGame,
  addGameToLibrary
};