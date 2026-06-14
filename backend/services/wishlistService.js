const wishlistModel = require('../models/wishlistModel');
const libraryModel = require('../models/libraryModel');
const userService = require('./userService');
const gameService = require('./gameService');

async function getWishlistByUserId(userId) {
  return wishlistModel.getWishlistByUserId(userId);
}

async function addGameToWishlist({ userId, gameId }) {
  const user = await userService.findUserById(userId);
  const game = await gameService.findGameById(gameId);
  if (!user || !game) return { error: 'Usuário ou jogo inválido' };
  if (await libraryModel.hasGame(user.id_usuario, game.id_jogo)) return { error: 'Usuário já possui este jogo' };
  if (await wishlistModel.hasInWishlist(user.id_usuario, game.id_jogo)) return { error: 'Jogo já está na wishlist' };

  await wishlistModel.addToWishlist(user.id_usuario, game.id_jogo);
  return { success: true };
}

async function removeGameFromWishlist({ userId, gameId }) {
  await wishlistModel.removeFromWishlist(userId, gameId);
  return { success: true };
}

module.exports = {
  getWishlistByUserId,
  addGameToWishlist,
  removeGameFromWishlist
};