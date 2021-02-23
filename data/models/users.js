const mongoose = require('mongoose');

let User = require('./manufacturer');

const boatSchema = new mongoose.Schema({
  name: String,
  manufacturer: mongoose.ObjectId
});

module.exports = mongoose.model('Boat', boatSchema);