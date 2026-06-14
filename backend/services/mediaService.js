const mediaModel = require('../models/mediaModel');

async function getGameMedia(gameId) {
  const [screenshots, videos] = await Promise.all([
    mediaModel.getScreenshotsByGameId(gameId),
    mediaModel.getVideosByGameId(gameId)
  ]);

  return { screenshots, videos };
}

module.exports = {
  getGameMedia
};