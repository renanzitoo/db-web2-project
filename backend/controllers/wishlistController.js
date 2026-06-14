const wishlistService = require('../services/wishlistService');

async function list(req, res) {
  res.json(await wishlistService.getWishlistByUserId(req.params.userId));
}

async function add(req, res) {
  const result = await wishlistService.addGameToWishlist(req.body);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json(result);
}

async function remove(req, res) {
  const result = await wishlistService.removeGameFromWishlist({ userId: req.params.userId, gameId: req.params.gameId });
  res.json(result);
}

module.exports = {
  list,
  add,
  remove
};