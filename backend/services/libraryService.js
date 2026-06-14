const libraryModel = require('../models/libraryModel');
const gameService = require('./gameService');
const userService = require('./userService');
const db = require('../config/db');

async function getLibraryByUserId(userId) {
  return libraryModel.getLibraryByUserId(userId);
}

async function purchaseGame({ userId, gameId }) {
  const user = await userService.findUserById(userId);
  const game = await gameService.findGameById(gameId);

  if (!user || !game) return { error: 'Usuário ou jogo inválido' };
  if (await libraryModel.hasGame(user.id_usuario, game.id_jogo)) {
    return { error: 'Usuário já possui este jogo' };
  }
  if (user.saldo_carteira < game.preco) return { error: 'Saldo insuficiente' };

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const newBalance = Number((user.saldo_carteira - game.preco).toFixed(2));

    await connection.query('UPDATE Usuarios SET saldo_carteira = ? WHERE id_usuario = ?', [newBalance, user.id_usuario]);
    await connection.query('INSERT INTO Biblioteca (id_usuario, id_jogo, data_aquisicao, horas_jogadas) VALUES (?, ?, CURDATE(), 0.00)', [user.id_usuario, game.id_jogo]);
    await connection.query('INSERT INTO Atividades (id_usuario, id_jogo, tipo_atividade, descricao, visibilidade, data_hora) VALUES (?, ?, ?, ?, ?, NOW())', [
      user.id_usuario,
      game.id_jogo,
      'comprou',
      `${user.nome} comprou ${game.titulo}`,
      'publica'
    ]);

    await connection.commit();
    return { user: { ...user, saldo_carteira: newBalance }, game };
  } catch (error) {
    await connection.rollback();
    return { error: 'Erro ao comprar jogo' };
  } finally {
    connection.release();
  }

}

module.exports = {
  getLibraryByUserId,
  purchaseGame
};