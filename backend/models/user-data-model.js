const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userDataSchema = new Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true},
  subscribedToWhatsApp: { type: Boolean, default: true },
}, { timestamps: true });

const UserData = mongoose.model('user-data', userDataSchema);

module.exports = UserData;