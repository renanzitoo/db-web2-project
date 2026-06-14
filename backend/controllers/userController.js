const userProfileService = require('../services/userProfileService');

async function profile(req, res) {
  const profileData = await userProfileService.getProfile(req.params.userId);
  if (!profileData) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(profileData);
}

module.exports = {
  profile
};