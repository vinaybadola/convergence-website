const express = require('express');
const router = express.Router();
const { submitForm, getAllData, generateQrCode,verifyQrCode } = require('../controllers/submit-controller');
const {submitFormValidator} = require('../validators/form-submit-validator');

router.post('/submit', submitForm);
// router.get('/get-all-data',submitFormValidator, getAllData);
router.post("/generate-qr", generateQrCode);
router.post("/verify-qr", verifyQrCode)

module.exports = router;