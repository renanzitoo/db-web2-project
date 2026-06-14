function status(req, res) {
  res.json({ status: 'ok', time: new Date() });
}

module.exports = {
  status
};