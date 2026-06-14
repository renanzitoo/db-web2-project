const userModel = require('../models/userModel');

async function registerUser({ nome, email, senha }) {
  if (!nome || !email || !senha) {
    return { error: 'Campos obrigatórios: nome, email, senha' };
  }

  const existingUser = await userModel.findUserByEmail(email);
  if (existingUser) {
    return { error: 'Email já cadastrado' };
  }

  const user = await userModel.createUser({ nome, email, senha });
  return { user };
}

async function loginUser({ email, senha }) {
  const user = await userModel.findUserByEmail(email);
  if (!user) return { error: 'Credenciais inválidas' };
  if (user.senha !== senha) return { error: 'Credenciais inválidas' };
  return { user };
}

async function findUserById(userId) {
  return userModel.findUserById(userId);
}

async function updateUserBalance(userId, saldoCarteira) {
  return userModel.updateUserBalance(userId, saldoCarteira);
}

module.exports = {
  registerUser,
  loginUser,
  findUserById,
  updateUserBalance
};