const express = require('express');
const router = express.Router();
const { submitForm, getAllData } = require('../controllers/submit-controller');

router.post('/submit', submitForm);
router.get('/get-all-data', getAllData);

module.exports = router;