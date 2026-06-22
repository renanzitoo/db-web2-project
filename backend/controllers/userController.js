const userProfileService = require('../services/userProfileService');
const userModel = require('../models/userModel');

async function profile(req, res) {
  const profileData = await userProfileService.getProfile(req.params.userId);
  if (!profileData) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(profileData);
}

async function deposit(req, res) {
  const userId = Number(req.params.userId);
  const { amount } = req.body;
  if (amount === undefined || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Valor inválido para depósito' });
  }

  const user = await userModel.findUserById(userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  const newBalance = Number(user.saldo_carteira) + Number(amount);
  const updatedUser = await userModel.updateUserBalance(userId, newBalance);

  res.json({ success: true, saldo_carteira: updatedUser.saldo_carteira });
}

module.exports = {
  profile,
  deposit
};