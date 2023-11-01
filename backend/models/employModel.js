var mongoose = require('mongoose');
var Schema = mongoose.Schema;

employSchema = new Schema({
  username: String,
  email: String,
  password: String,
  face: String
}),
  employ = mongoose.model('employ', employSchema);

module.exports = employ;