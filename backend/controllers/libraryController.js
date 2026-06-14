const libraryService = require('../services/libraryService');

async function purchase(req, res) {
  const result = await libraryService.purchaseGame(req.body);
  if (result.error) return res.status(400).json({ error: result.error });
  res.json({ success: true, saldo_carteira: result.user.saldo_carteira });
}

async function library(req, res) {
  res.json(await libraryService.getLibraryByUserId(req.params.userId));
}

module.exports = {
  purchase,
  library
};