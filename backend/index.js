const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// In-memory data (mock)
const users = [
  // senha em texto claro apenas para demonstração
  { id_usuario: 1, nome: 'Alice', email: 'alice@example.com', senha: 'senha', saldo_carteira: 50.00, data_cadastro: '2026-01-01' }
];

const categories = [
  { id_categoria: 1, nome_categoria: 'Ação', descricao: 'Jogos de ação' },
  { id_categoria: 2, nome_categoria: 'RPG', descricao: 'Role-playing games' }
];

const games = [
  { id_jogo: 1, titulo: 'Aventura 1', descricao: 'Jogo de aventura', preco: 19.90, data_lancamento: '2025-06-01', id_categoria: 1 },
  { id_jogo: 2, titulo: 'RPG Épico', descricao: 'RPG imersivo', preco: 39.90, data_lancamento: '2024-11-11', id_categoria: 2 }
];

const biblioteca = [
  // { id_usuario: 1, id_jogo: 2, data_aquisicao: '2026-05-01' }
];

// API routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Jogos / Categorias
app.get('/api/games', (req, res) => {
  res.json(games);
});

app.get('/api/games/:id', (req, res) => {
  const id = Number(req.params.id);
  const g = games.find(x => x.id_jogo === id);
  if (!g) return res.status(404).json({ error: 'Jogo não encontrado' });
  res.json(g);
});

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

// Usuários (registro / login simples em memória)
app.post('/api/register', (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ error: 'Campos obrigatórios: nome, email, senha' });
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email já cadastrado' });
  const id_usuario = users.length ? users[users.length - 1].id_usuario + 1 : 1;
  const user = { id_usuario, nome, email, senha, saldo_carteira: 0.00, data_cadastro: new Date().toISOString().split('T')[0] };
  users.push(user);
  res.status(201).json({ id_usuario, nome, email });
});

app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;
  const u = users.find(x => x.email === email && x.senha === senha);
  if (!u) return res.status(401).json({ error: 'Credenciais inválidas' });
  res.json({ id_usuario: u.id_usuario, nome: u.nome, saldo_carteira: u.saldo_carteira });
});

// Comprar jogo (simulado): body { userId, gameId }
app.post('/api/purchase', (req, res) => {
  const { userId, gameId } = req.body;
  const user = users.find(u => u.id_usuario === Number(userId));
  const game = games.find(g => g.id_jogo === Number(gameId));
  if (!user || !game) return res.status(400).json({ error: 'Usuário ou jogo inválido' });
  // já possui?
  if (biblioteca.find(b => b.id_usuario === user.id_usuario && b.id_jogo === game.id_jogo)) {
    return res.status(400).json({ error: 'Usuário já possui este jogo' });
  }
  if (user.saldo_carteira < game.preco) return res.status(400).json({ error: 'Saldo insuficiente' });
  user.saldo_carteira = Number((user.saldo_carteira - game.preco).toFixed(2));
  biblioteca.push({ id_usuario: user.id_usuario, id_jogo: game.id_jogo, data_aquisicao: new Date().toISOString().split('T')[0] });
  res.json({ success: true, saldo_carteira: user.saldo_carteira });
});

app.get('/api/library/:userId', (req, res) => {
  const userId = Number(req.params.userId);
  const entries = biblioteca.filter(b => b.id_usuario === userId);
  const owned = entries.map(e => games.find(g => g.id_jogo === e.id_jogo));
  res.json(owned);
});

// Fallback to index.html for SPA routes
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
