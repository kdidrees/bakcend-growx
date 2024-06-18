const express = require("express");

const {
  advertiserLogin,
  advertiserSignup,
  advertiserForgetPassword,
  getAllEmail,
  updatePassword,
} = require("../controllers/advertiser/advertiserController");
const {
  createCampaign,
  getCampaignById,
  deleteCampaign,
  getCampaigns,
  updateCampaign,
  doStartorPauseCampaign,
} = require("../controllers/advertiser/campaignController");
const { authmidleware } = require("../middleware/authenticationMiddleWare");
const { campaignImagesUpload } = require("../middleware/MulterImageMiddeware");
const {
  addWallet,
  getWallet,
} = require("../controllers/advertiser/walletController");
const {
  getPublisherMatchCategory,
} = require("../controllers/publisher/addZoneController");

const advertiserRouter = express.Router();
advertiserRouter.get("/getPublisherMatchCategory", getPublisherMatchCategory);

advertiserRouter.post("/emailSend/:email", advertiserForgetPassword);
advertiserRouter.get("/getAllEmail/:email", getAllEmail);
advertiserRouter.post("/updatepassword/:email", updatePassword);
// Login and Signup Routes
advertiserRouter.post("/advertiserlogin", advertiserLogin);
advertiserRouter.post("/advertisersignup", advertiserSignup);

advertiserRouter.use(authmidleware);
//Campaign Routes

advertiserRouter.post("/create-campaign", campaignImagesUpload, createCampaign);
advertiserRouter.get("/get-campaigns", getCampaigns);
advertiserRouter.put("/update-campaign/:campaignId", updateCampaign);
advertiserRouter.delete("/delete-campaign/:id", deleteCampaign);
advertiserRouter.get("/single-campaign/:campaignId", getCampaignById);

advertiserRouter.put(
  "/start-or-pause-campaign/:campaignId",
  doStartorPauseCampaign
);

//Wallet Routes
advertiserRouter.post("/addAmount", addWallet);
advertiserRouter.get("/getallAmmount", getWallet);

module.exports = advertiserRouter;
