const db = require('../config/db');

async function getScreenshotsByGameId(gameId) {
  const [rows] = await db.query(
    'SELECT * FROM Screenshots_Jogos WHERE id_jogo = ? ORDER BY ordem ASC, id_screenshot ASC',
    [gameId]
  );
  return rows;
}

async function getVideosByGameId(gameId) {
  const [rows] = await db.query(
    'SELECT * FROM Videos_Jogos WHERE id_jogo = ? ORDER BY id_video ASC',
    [gameId]
  );
  return rows;
}

module.exports = {
  getScreenshotsByGameId,
  getVideosByGameId
};