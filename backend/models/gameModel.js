const db = require('../config/db');
const { mapGameMedia, mapScreenshotMedia } = require('../utils/media');

function mapGames(rows) {
  return rows.map(mapGameMedia);
}

async function findAllGames() {
  const [rows] = await db.query(`
    SELECT j.*, c.nome_categoria, c.descricao AS categoria_descricao
    FROM Jogos j
    INNER JOIN Categorias c ON c.id_categoria = j.id_categoria
    ORDER BY j.id_jogo DESC
  `);
  return mapGames(rows);
}

async function findAllCategories() {
  const [rows] = await db.query('SELECT * FROM Categorias ORDER BY nome_categoria ASC');
  return rows;
}

async function findGameById(gameId) {
  const [rows] = await db.query(`
    SELECT j.*, c.nome_categoria, c.descricao AS categoria_descricao
    FROM Jogos j
    INNER JOIN Categorias c ON c.id_categoria = j.id_categoria
    WHERE j.id_jogo = ?
    LIMIT 1
  `, [gameId]);
  return mapGameMedia(rows[0] || null);
}

async function getFeaturedGames(limit = 4) {
  const [rows] = await db.query(`
    SELECT j.*, c.nome_categoria, c.descricao AS categoria_descricao,
           COALESCE(r.nota_media, 0) AS nota_media,
           COALESCE(r.total_avaliacoes, 0) AS total_avaliacoes
    FROM Jogos j
    INNER JOIN Categorias c ON c.id_categoria = j.id_categoria
    LEFT JOIN (
      SELECT id_jogo, ROUND(AVG(nota), 1) AS nota_media, COUNT(*) AS total_avaliacoes
      FROM Avaliacoes
      GROUP BY id_jogo
    ) r ON r.id_jogo = j.id_jogo
    ORDER BY nota_media DESC, total_avaliacoes DESC, j.data_lancamento DESC
    LIMIT ?
  `, [limit]);
  return mapGames(rows);
}

async function getSaleGames(limit = 4) {
  const [rows] = await db.query(`
    SELECT j.*, c.nome_categoria, c.descricao AS categoria_descricao
    FROM Jogos j
    INNER JOIN Categorias c ON c.id_categoria = j.id_categoria
    ORDER BY j.data_lancamento DESC, j.preco ASC
    LIMIT ?
  `, [limit]);
  return mapGames(rows);
}

async function getRandomRecommendations(limit = 4, ownedGameIds = []) {
  let whereClause = '';
  const params = [];

  if (ownedGameIds.length) {
    whereClause = `WHERE j.id_jogo NOT IN (${ownedGameIds.map(() => '?').join(', ')})`;
    params.push(...ownedGameIds);
  }

  params.push(limit);

  const [rows] = await db.query(`
    SELECT j.*, c.nome_categoria, c.descricao AS categoria_descricao
    FROM Jogos j
    INNER JOIN Categorias c ON c.id_categoria = j.id_categoria
    ${whereClause}
    ORDER BY RAND()
    LIMIT ?
  `, params);

  return mapGames(rows);
}

async function getGameFeed(ownedGameIds = []) {
  const [destaques, promocoes, recomendados] = await Promise.all([
    getFeaturedGames(4),
    getSaleGames(4),
    getRandomRecommendations(4, ownedGameIds)
  ]);

  const [recentes] = await db.query(`
    SELECT j.*, c.nome_categoria, c.descricao AS categoria_descricao
    FROM Jogos j
    INNER JOIN Categorias c ON c.id_categoria = j.id_categoria
    ORDER BY j.data_lancamento DESC, j.id_jogo DESC
    LIMIT 4
  `);

  return {
    destaques,
    promocoes,
    recomendados,
    recentes: mapGames(recentes)
  };
}

async function getScreenshotsByGameId(gameId) {
  const [rows] = await db.query(`
    SELECT *
    FROM Screenshots_Jogos
    WHERE id_jogo = ?
    ORDER BY ordem ASC, id_screenshot ASC
  `, [gameId]);

  return rows.map(mapScreenshotMedia);
}

async function getVideosByGameId(gameId) {
  const [rows] = await db.query(`
    SELECT *
    FROM Videos_Jogos
    WHERE id_jogo = ?
    ORDER BY id_video ASC
  `, [gameId]);

  return rows.map(video => ({
    ...video,
    video_url: video.video_url && !/^https?:\/\//i.test(video.video_url)
      ? `/media/${String(video.video_url).replace(/^\/+/, '')}`
      : video.video_url
  }));
}

async function getGameDetails(gameId) {
  const [game, screenshots, videos] = await Promise.all([
    findGameById(gameId),
    getScreenshotsByGameId(gameId),
    getVideosByGameId(gameId)
  ]);

  return {
    game,
    screenshots,
    videos
  };
}

module.exports = {
  findAllGames,
  findAllCategories,
  findGameById,
  getFeaturedGames,
  getSaleGames,
  getRandomRecommendations,
  getGameFeed,
  getScreenshotsByGameId,
  getVideosByGameId,
  getGameDetails
};