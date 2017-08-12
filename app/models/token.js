// Load required packages
var mongoose = require('mongoose');

// Define our token schema
var TokenSchema   = new mongoose.Schema({
  value: { type: String, required: true },
  scope: { type: Array, required: true },
  clientId: { type: String, required: true },
  expirationDate: { type: Date, required: true },
});

// Export the Mongoose model
module.exports = mongoose.model('Token', TokenSchema);