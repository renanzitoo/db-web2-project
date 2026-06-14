const gameModel = require('../models/gameModel');

async function findAllGames() {
  return gameModel.findAllGames();
}

async function findAllCategories() {
  return gameModel.findAllCategories();
}

async function findGameById(id) {
  return gameModel.findGameById(id);
}

async function getFeaturedGames(limit = 4) {
  return gameModel.getFeaturedGames(limit);
}

async function getSaleGames(limit = 4) {
  return gameModel.getSaleGames(limit);
}

async function getRandomRecommendations(limit = 4, ownedGameIds = []) {
  return gameModel.getRandomRecommendations(limit, ownedGameIds);
}

async function getGameFeed(ownedGameIds = []) {
  return gameModel.getGameFeed(ownedGameIds);
}

module.exports = {
  findAllGames,
  findAllCategories,
  findGameById,
  getFeaturedGames,
  getSaleGames,
  getRandomRecommendations,
  getGameFeed
};