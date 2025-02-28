const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userDataSchema = new Schema({
  name: String,
  whatsapp: String,
}, { timestamps: true });

const UserData = mongoose.model('UserData', userDataSchema);

module.exports = UserData;