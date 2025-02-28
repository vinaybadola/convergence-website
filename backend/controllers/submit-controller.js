const userDataModel = require("../models/user-data-model");

const submitForm = async (req, res) => {
    try {
        const { name, whatsapp } = req.body;

        if (!name || !whatsapp) {
            return res.status(400).json({ message: 'Please provide name and whatsapp' });
        }

        const newForm = new userDataModel({ name, whatsapp });
        await newForm.save();

        // use the whatsapp API to send a message

        res.status(200).json({ success: true, message: 'Form submitted successfully' });
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        return res.status(500).json({ success: false, error: 'An error occurred while sending WhatsApp message' });
    }
};

const getAllData = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const data = await userDataModel.find().limit(limit * 1).skip((page - 1) * limit);
        const total = await userDataModel.countDocuments();
        if(data.length == 0) {
            return res.status(404).json({ success: false, message: 'Data not found' });
        }
        return res.status(200).json({ success: true, data, total });
    } catch (err) {
        console.log('An error occurred while fetching data', err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { submitForm, getAllData };