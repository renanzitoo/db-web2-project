const userService = require('../services/userService');

async function register(req, res) {
  const result = await userService.registerUser(req.body);
  if (result.error) return res.status(400).json({ error: result.error });
  const { user } = result;
  res.status(201).json({ id_usuario: user.id_usuario, nome: user.nome, email: user.email });
}

async function login(req, res) {
  const result = await userService.loginUser(req.body);
  if (result.error) return res.status(401).json({ error: result.error });
  const { user } = result;
  res.json({ id_usuario: user.id_usuario, nome: user.nome, saldo_carteira: user.saldo_carteira });
}

module.exports = {
  register,
  login
};