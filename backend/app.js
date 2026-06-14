const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/media', express.static(path.join(__dirname, 'media')));
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use('/api', apiRoutes);

app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

module.exports = app;