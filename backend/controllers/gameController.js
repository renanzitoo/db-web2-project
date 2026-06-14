const gameService = require('../services/gameService');
const libraryService = require('../services/libraryService');
const mediaService = require('../services/mediaService');
const socialService = require('../services/socialService');

async function listGames(req, res) {
  res.json(await gameService.findAllGames());
}

async function listCategories(req, res) {
  res.json(await gameService.findAllCategories());
}

async function getGameById(req, res) {
  const game = await gameService.findGameById(req.params.id);
  if (!game) return res.status(404).json({ error: 'Jogo não encontrado' });
  res.json(game);
}

async function getHomeFeed(req, res) {
  const userId = req.query.userId ? Number(req.query.userId) : null;
  const ownedGameIds = [];

  if (userId) {
    const library = await libraryService.getLibraryByUserId(userId);
    library.forEach(item => ownedGameIds.push(item.id_jogo));
  }

  const feed = await gameService.getGameFeed(ownedGameIds);
  res.json(feed);
}

async function getGameDetails(req, res) {
  const game = await gameService.findGameById(req.params.gameId);
  if (!game) return res.status(404).json({ error: 'Jogo não encontrado' });

  const [media, achievements, reviews] = await Promise.all([
    mediaService.getGameMedia(req.params.gameId),
    socialService.getAchievementsByGameId(req.params.gameId),
    socialService.getReviewsByGameId(req.params.gameId)
  ]);

  res.json({
    game,
    screenshots: media.screenshots,
    videos: media.videos,
    achievements,
    reviews
  });
}

module.exports = {
  listGames,
  listCategories,
  getGameById,
  getHomeFeed,
  getGameDetails
};