const db = require('../config/db');
const { mapGameMedia } = require('../utils/media');

async function getCartByUserId(userId) {
  const [rows] = await db.query(`
    SELECT c.id_usuario, c.id_jogo, c.data_adicao, j.*, cat.nome_categoria, cat.descricao AS categoria_descricao
    FROM Carrinho c
    INNER JOIN Jogos j ON j.id_jogo = c.id_jogo
    INNER JOIN Categorias cat ON cat.id_categoria = j.id_categoria
    WHERE c.id_usuario = ?
    ORDER BY c.data_adicao DESC
  `, [userId]);

  return rows.map(row => mapGameMedia(row));
}

async function hasCartItem(userId, gameId) {
  const [rows] = await db.query('SELECT 1 FROM Carrinho WHERE id_usuario = ? AND id_jogo = ? LIMIT 1', [userId, gameId]);
  return rows.length > 0;
}

async function addCartItem(userId, gameId) {
  await db.query('INSERT INTO Carrinho (id_usuario, id_jogo, data_adicao) VALUES (?, ?, NOW())', [userId, gameId]);
}

async function removeCartItem(userId, gameId) {
  await db.query('DELETE FROM Carrinho WHERE id_usuario = ? AND id_jogo = ?', [userId, gameId]);
}

module.exports = {
  getCartByUserId,
  hasCartItem,
  addCartItem,
  removeCartItem
};