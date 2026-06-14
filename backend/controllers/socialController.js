const socialService = require('../services/socialService');

async function achievementsByGame(req, res) {
  res.json(await socialService.getAchievementsByGameId(req.params.gameId));
}

async function userAchievements(req, res) {
  res.json(await socialService.getUserAchievements(req.params.userId));
}

async function friends(req, res) {
  res.json(await socialService.getFriendsByUserId(req.params.userId));
}

async function activities(req, res) {
  res.json(await socialService.getActivities());
}

async function reviewsByGame(req, res) {
  res.json(await socialService.getReviewsByGameId(req.params.gameId));
}

async function createReview(req, res) {
  const result = await socialService.createReview(req.body);
  if (result.error) return res.status(400).json({ error: result.error });
  res.status(201).json(result);
}

async function requestFriend(req, res) {
  const result = await socialService.upsertFriendRequest(req.body);
  if (result.error) return res.status(400).json({ error: result.error });
  res.status(201).json(result);
}

async function updateFriend(req, res) {
  const result = await socialService.updateFriendStatus(req.params.friendshipId, req.body.status_amizade);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json(result);
}

async function deleteFriend(req, res) {
  const result = await socialService.removeFriendship(req.params.friendshipId);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json(result);
}

module.exports = {
  achievementsByGame,
  userAchievements,
  friends,
  activities,
  reviewsByGame,
  createReview,
  requestFriend,
  updateFriend,
  deleteFriend
};