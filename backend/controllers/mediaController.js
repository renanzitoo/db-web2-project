const mediaService = require('../services/mediaService');

async function gameMedia(req, res) {
  res.json(await mediaService.getGameMedia(req.params.gameId));
}

module.exports = {
  gameMedia
};