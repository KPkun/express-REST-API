// app/models/user.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClientSchema = new Schema({
  name: { type: String, unique: true, required: true},
  secret: { type: String, required: true },
  clientId: { type: String, required: true}
});

module.exports = mongoose.model('Client', ClientSchema);
