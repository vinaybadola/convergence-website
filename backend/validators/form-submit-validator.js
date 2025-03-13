const { body } = require("express-validator");

exports.submitFormValidator = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("mobileNumber")
        .trim()
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Enter a valid 10-digit mobile number"),
    body("subscribedToWhatsApp").isBoolean().optional(),
];

