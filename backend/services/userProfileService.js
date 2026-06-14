const userModel = require('../models/userModel');

async function getProfile(userId) {
  return userModel.findUserProfile(userId);
}

module.exports = {
  getProfile
};