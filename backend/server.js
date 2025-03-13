const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 9000;
const connectDB = require('./database');
const path = require("path");

// Middleware
app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    accept: "application/json"
}));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use("/public", express.static(path.join(__dirname, "public")));

// MongoDB Connection
connectDB();

// Route to serve a specific PDF file
app.get('/get-brochure', (req, res) => {
  const filePath = `${__dirname}/public/wibro-convergence-brochure.pdf`;
  return res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving the file:', err);
      res.status(404).send('File not found');
    }
  });
});

//Routes 
const submitFormRoute = require('./routes/submit-form-route');

app.use("/api/form", submitFormRoute);

// Home route
app.get('/', (req, res) => {
  return res.send('Welcome to Gigantic');
});

app.get("/*", (req, res) => {
  return res.status(404).send("Page not found");
});

// Start Server
app.listen(PORT, (err) => {
    if (err) {
        console.error('Error starting server:', err);
    }
    console.log(`Server listening on port ${PORT}`);
});