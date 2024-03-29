const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  active: {
      type: Boolean,
      required: true,
      default: false
  }
});

module.exports = mongoose.model('User', userSchema);