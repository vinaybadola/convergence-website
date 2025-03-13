const userDataModel = require("../models/user-data-model");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const QrScanData = require("../models/qr-code-scans-model");

const submitForm = async (req, res) => {
    try {
        const { name, mobileNumber, subscribedToWhatsApp  } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        if (!name || !mobileNumber) {
            return res.status(400).json({ message: 'Please provide name and whatsapp' });
        }

        const newForm = new userDataModel({ name, mobileNumber , subscribedToWhatsApp });
        await newForm.save();
        
        const pdfPath = "public/wibro-convergence-brochure.pdf"
        res.status(200).json({ success: true, message: 'Form submitted successfully',  pdfUrl: pdfPath, });

        setTimeout(() => sendWhatsAppMessage(name,mobileNumber), 0);

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

const generateQrCode = async(req,res)=>{
    try {
        const { location } = req.body;

        if (!location) {
            return res.status(400).json({ success: false, error: "Location is required" });
        }

        const qrId = uuidv4();
        const frontendUrl = process.env.FRONTEND_URL;

        if (!frontendUrl) {
            console.error("FRONTEND_URL is not defined in .env");
            return res.status(500).json({ success: false, error: "Server configuration error" });
        }

        const url = `${frontendUrl}/convergence-form?qrId=${qrId}`;
        const qrDataUrl = await QRCode.toDataURL(url);

        await QrScanData.create({ qrId, location , qrDataUrl : qrDataUrl});
        return res.json({ success: true, qrId, qrDataUrl });

    } catch (error) {
    console.error('Error generating QR code:', error)
    if(error instanceof Error) {
        return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(500).json({ success: false, message: 'An error occurred while generating QR code', error: err.message });
  }
}

const sendWhatsAppMessage = async (name,mobileNumber) => {
    try {
        if (!process.env.WHATSAPP_API || !process.env.API_KEY) {
            console.error("WhatsApp API or API Key not found");
            return;
        }
        if (!mobileNumber) {
            console.error("Mobile number not provided");
            return;
        }
        const response = await fetch(process.env.WHATSAPP_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                apiKey: process.env.API_KEY,
                campaignName: "Convergence_F",
                destination: `+91${mobileNumber}`,
                userName: name || "Subscriber",
                templateParams: [],
                media: {
                    url: "https://whatsapp-media-library.s3.ap-south-1.amazonaws.com/FILE/6600405a0dee457cf7835ca1/5841109_WibroBrochurecompressed.pdf",
                    filename: "Wibro Brochure",
                },
            }),
        });        
        console.log("WhatsApp message sent successfully:", response);
        return response;
    } catch (error) {
        console.error("Error sending WhatsApp message:", error.response ? error.response.data : error.message);
    }
};

const verifyQrCode = async (req, res) => {
    try {
        const { qrId } = req.body;
        if (!qrId) {
            return res.status(400).json({ success: false, error: "QR ID is required" });
        }
        const qrData = await QrScanData.findOne({ qrId });
        if (!qrData) {
            return res.status(404).json({ success: false, error: "QR ID not found" });
        }
        return res.json({ success: true, data: qrData });
    } catch (error) {
        console.error("Error verifying QR code:", error);
        return res.status(500).json({ success: false, error: "An error occurred while verifying QR code" });
    }
};

module.exports = { submitForm, getAllData,generateQrCode, verifyQrCode };