const cartService = require('../services/cartService');

async function list(req, res) {
  res.json(await cartService.getCartByUserId(req.params.userId));
}

async function add(req, res) {
  const result = await cartService.addGameToCart(req.body);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json(result);
}

async function remove(req, res) {
  const result = await cartService.removeGameFromCart({ userId: req.params.userId, gameId: req.params.gameId });
  res.json(result);
}

async function checkout(req, res) {
  const result = await cartService.checkoutCart(req.params.userId);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json(result);
}

module.exports = {
  list,
  add,
  remove,
  checkout
};