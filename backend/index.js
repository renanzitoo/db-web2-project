const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// In-memory example data
const items = [
  { id: 1, name: 'Exemplo 1' },
  { id: 2, name: 'Exemplo 2' }
];

// API routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

app.get('/api/items', (req, res) => {
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Campo name é obrigatório' });
  const id = items.length ? items[items.length - 1].id + 1 : 1;
  const item = { id, name };
  items.push(item);
  res.status(201).json(item);
});

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
