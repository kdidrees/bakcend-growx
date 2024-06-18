const express = require('express');
const app = express();
const cors = require('cors');
 
const publisherRouter = require('./src/routes/publisherRoutes');
const managerRouter = require('./src/routes/managerRoutes');
const advertiserRouter = require('./src/routes/advertiserRoutes');
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Allow all origins for demonstration purposes

app.use("/image", express.static(__dirname + "/public/image"));

app.use("/advertiser", advertiserRouter);
app.use("/publisher", publisherRouter);
app.use("/manager", managerRouter);

module.exports = app;
