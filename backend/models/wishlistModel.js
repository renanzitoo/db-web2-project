const db = require('../config/db');
const { mapGameMedia } = require('../utils/media');

async function getWishlistByUserId(userId) {
  const [rows] = await db.query(`
    SELECT w.id_usuario, w.id_jogo, w.data_adicao, j.*, cat.nome_categoria, cat.descricao AS categoria_descricao
    FROM Wishlist w
    INNER JOIN Jogos j ON j.id_jogo = w.id_jogo
    INNER JOIN Categorias cat ON cat.id_categoria = j.id_categoria
    WHERE w.id_usuario = ?
    ORDER BY w.data_adicao DESC
  `, [userId]);

  return rows.map(row => mapGameMedia(row));
}

async function hasWishlistItem(userId, gameId) {
  const [rows] = await db.query('SELECT 1 FROM Wishlist WHERE id_usuario = ? AND id_jogo = ? LIMIT 1', [userId, gameId]);
  return rows.length > 0;
}

async function addWishlistItem(userId, gameId) {
  await db.query('INSERT INTO Wishlist (id_usuario, id_jogo, data_adicao) VALUES (?, ?, NOW())', [userId, gameId]);
}

async function removeWishlistItem(userId, gameId) {
  await db.query('DELETE FROM Wishlist WHERE id_usuario = ? AND id_jogo = ?', [userId, gameId]);
}

module.exports = {
  getWishlistByUserId,
  hasWishlistItem,
  hasInWishlist: hasWishlistItem,
  addWishlistItem,
  addToWishlist: addWishlistItem,
  removeWishlistItem,
  removeFromWishlist: removeWishlistItem
};