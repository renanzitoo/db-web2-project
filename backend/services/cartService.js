const cartModel = require('../models/cartModel');
const libraryModel = require('../models/libraryModel');
const userService = require('./userService');
const gameService = require('./gameService');
const db = require('../config/db');

async function getCartByUserId(userId) {
  return cartModel.getCartByUserId(userId);
}

async function addGameToCart({ userId, gameId }) {
  const user = await userService.findUserById(userId);
  const game = await gameService.findGameById(gameId);
  if (!user || !game) return { error: 'Usuário ou jogo inválido' };
  if (await libraryModel.hasGame(user.id_usuario, game.id_jogo)) return { error: 'Usuário já possui este jogo' };
  if (await cartModel.hasInCart(user.id_usuario, game.id_jogo)) return { error: 'Jogo já está no carrinho' };

  await cartModel.addToCart(user.id_usuario, game.id_jogo);
  return { success: true };
}

async function removeGameFromCart({ userId, gameId }) {
  await cartModel.removeFromCart(userId, gameId);
  return { success: true };
}

async function checkoutCart(userId) {
  const connection = await db.getConnection();
  const user = await userService.findUserById(userId);

  if (!user) return { error: 'Usuário inválido' };

  try {
    await connection.beginTransaction();
    const [items] = await connection.query(`
      SELECT j.id_jogo, j.preco, j.titulo
      FROM Carrinho c
      INNER JOIN Jogos j ON j.id_jogo = c.id_jogo
      WHERE c.id_usuario = ?
    `, [userId]);

    const total = items.reduce((sum, item) => sum + Number(item.preco), 0);
    if (Number(user.saldo_carteira) < total) {
      throw new Error('Saldo insuficiente');
    }

    const newBalance = Number((Number(user.saldo_carteira) - total).toFixed(2));
    await connection.query('UPDATE Usuarios SET saldo_carteira = ? WHERE id_usuario = ?', [newBalance, userId]);

    for (const item of items) {
      await connection.query('INSERT INTO Biblioteca (id_usuario, id_jogo, data_aquisicao, horas_jogadas) VALUES (?, ?, NOW(), 0.00)', [userId, item.id_jogo]);
      await connection.query('INSERT INTO Atividades (id_usuario, id_jogo, tipo_atividade, descricao, visibilidade, data_hora) VALUES (?, ?, ?, ?, ?, NOW())', [
        userId,
        item.id_jogo,
        'comprou',
        `${user.nome} comprou ${item.titulo}`,
        'publica'
      ]);
    }

    await connection.query('DELETE FROM Carrinho WHERE id_usuario = ?', [userId]);
    await connection.commit();
    return { success: true, saldo_carteira: newBalance };
  } catch (error) {
    await connection.rollback();
    return { error: error.message || 'Erro ao finalizar compra' };
  } finally {
    connection.release();
  }
}

module.exports = {
  getCartByUserId,
  addGameToCart,
  removeGameFromCart,
  checkoutCart
};