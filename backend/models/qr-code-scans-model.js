const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const qrScanSchema = new Schema({
    qrId: { type: String, unique: true }, 
    qrDataUrl :{type: String},
    location: String, 
    scanCount: { type: Number, default: 0 }, 
    scans: [{
      scannedAt: { type: Date, default: Date.now },
      userAgent: String, 
      ipAddress: String,
    }],
}, {timestamps : true});

const QrScanData = mongoose.model('qr-scan', qrScanSchema);

module.exports = QrScanData;


