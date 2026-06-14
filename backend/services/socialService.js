const socialModel = require('../models/socialModel');

async function getAchievementsByGameId(gameId) {
  return socialModel.getAchievementsByGameId(gameId);
}

async function getUserAchievements(userId) {
  return socialModel.getUserAchievements(userId);
}

async function getFriendsByUserId(userId) {
  return socialModel.getFriendsByUserId(userId);
}

async function getActivities() {
  return socialModel.getActivities();
}

async function getReviewsByGameId(gameId) {
  return socialModel.getReviewsByGameId(gameId);
}

async function createReview(payload) {
  if (!payload?.userId || !payload?.gameId || !payload?.nota) {
    return { error: 'Campos obrigatórios: userId, gameId, nota' };
  }

  const id_avaliacao = await socialModel.createReview(payload);
  return { id_avaliacao };
}

async function upsertFriendRequest(payload) {
  if (!payload?.userId || !payload?.friendId) {
    return { error: 'Campos obrigatórios: userId e friendId' };
  }

  const id_amizade = await socialModel.upsertFriendRequest(payload);
  return { id_amizade };
}

async function updateFriendStatus(friendshipId, statusAmizade) {
  if (!friendshipId || !statusAmizade) return { error: 'Campos obrigatórios: status_amizade' };
  await socialModel.updateFriendStatus(friendshipId, statusAmizade);
  return { success: true };
}

async function removeFriendship(friendshipId) {
  await socialModel.deleteFriendship(friendshipId);
  return { success: true };
}

module.exports = {
  getAchievementsByGameId,
  getUserAchievements,
  getFriendsByUserId,
  getActivities,
  getReviewsByGameId,
  createReview,
  upsertFriendRequest,
  updateFriendStatus,
  removeFriendship
};