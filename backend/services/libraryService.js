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

    await connection.commit();
    return { user: { ...user, saldo_carteira: newBalance }, game };
  } catch (error) {
    await connection.rollback();
    return { error: 'Erro ao comprar jogo' };
  } finally {
    connection.release();
  }

}

async function playGame(userId, gameId) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Check if user owns the game
    const [libRows] = await connection.query(
      'SELECT horas_jogadas FROM Biblioteca WHERE id_usuario = ? AND id_jogo = ? LIMIT 1',
      [userId, gameId]
    );

    if (libRows.length === 0) {
      return { error: 'Você não possui este jogo em sua biblioteca.' };
    }

    const currentHours = Number(libRows[0].horas_jogadas);
    const hoursAdded = Number((Math.random() * 3 + 0.5).toFixed(1)); // Add between 0.5 and 3.5 hours
    const totalHours = Number((currentHours + hoursAdded).toFixed(1));

    // Update playtime
    await connection.query(
      'UPDATE Biblioteca SET horas_jogadas = ? WHERE id_usuario = ? AND id_jogo = ?',
      [totalHours, userId, gameId]
    );

    // Get user and game details
    const [[user]] = await connection.query('SELECT nome FROM Usuarios WHERE id_usuario = ? LIMIT 1', [userId]);
    const [[game]] = await connection.query('SELECT titulo FROM Jogos WHERE id_jogo = ? LIMIT 1', [gameId]);

    // Create activity record
    await connection.query(
      'INSERT INTO Atividades (id_usuario, id_jogo, tipo_atividade, descricao, visibilidade, data_hora) VALUES (?, ?, ?, ?, ?, NOW())',
      [
        userId,
        gameId,
        'jogou',
        `${user.nome} jogou ${game.titulo} por mais ${hoursAdded} horas.`,
        'publica'
      ]
    );

    // Check achievements
    let unlockedAchievementName = null;
    const [achievements] = await connection.query(
      'SELECT * FROM Conquistas WHERE id_jogo = ?',
      [gameId]
    );

    if (achievements.length > 0) {
      const [unlockedRows] = await connection.query(
        'SELECT id_conquista FROM Usuario_Conquistas WHERE id_usuario = ?',
        [userId]
      );
      const unlockedIds = unlockedRows.map(r => r.id_conquista);
      const lockedAchievements = achievements.filter(a => !unlockedIds.includes(a.id_conquista));

      if (lockedAchievements.length > 0 && Math.random() < 0.4) { // 40% chance of unlocking
        const randomAch = lockedAchievements[Math.floor(Math.random() * lockedAchievements.length)];
        await connection.query(
          'INSERT INTO Usuario_Conquistas (id_usuario, id_conquista, data_desbloqueio) VALUES (?, ?, NOW())',
          [userId, randomAch.id_conquista]
        );
        
        unlockedAchievementName = randomAch.nome_conquista;

        // Log achievement unlock activity
        await connection.query(
          'INSERT INTO Atividades (id_usuario, id_jogo, tipo_atividade, descricao, visibilidade, data_hora) VALUES (?, ?, ?, ?, ?, NOW())',
          [
            userId,
            gameId,
            'conquista',
            `${user.nome} desbloqueou a conquista "${randomAch.nome_conquista}" em ${game.titulo}!`,
            'publica'
          ]
        );
      }
    }

    await connection.commit();
    return {
      success: true,
      hoursAdded,
      totalHours,
      unlockedAchievement: unlockedAchievementName
    };
  } catch (error) {
    await connection.rollback();
    console.error('Error during playGame:', error);
    return { error: 'Erro ao rodar simulação do jogo' };
  } finally {
    connection.release();
  }
}

module.exports = {
  getLibraryByUserId,
  purchaseGame,
  playGame
};