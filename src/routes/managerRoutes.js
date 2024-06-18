const express = require('express');
const { getSingleCampaignbyUser } = require("../controllers/advertiser/campaignController")
const { updateCampaignByAdmin, getAllCampaignForAdmin, allAdvertiser, updateDataCampain, campaignCart, singleAllCampaign } = require("../controllers/manager/campainController")
 
const { campaignImagesUpload } = require('../middleware/MulterImageMiddeware');
const { managerLogin, managerSignup, mangerLoginDetail, goToAdvertiser } = require('../controllers/manager/managerController');
const image_upload = require('../middleware/Profileimage');
const { authmidleware } = require('../middleware/authenticationMiddleWare');
const { getPublisherCart, singelAllPublisher, deleteManagerSite } = require('../controllers/manager/publisherControler');
const { statusUpdate } = require('../controllers/publisher/siteController');

const managerRouter = express.Router()
// Admin Auth 
managerRouter.post('/managerlogin', managerLogin)
managerRouter.post('/managersignup',image_upload.single("profilePic"), managerSignup)
managerRouter.post("/goToAdvertiser/:id",goToAdvertiser)
// managerRouter.post('/managerlogin',image_upload.single("profilePic"), managerSignup)
// managerRouter.post('/managerLogin',managerLogin)
// managerRouter.post('/managersignup', managerSignup)
//managerRouter.get('/forgetpassword', ForgetPassword)

//Campaign Routes

managerRouter.use(authmidleware)
managerRouter.get("/allAvertiseruserdetail",mangerLoginDetail)
managerRouter.get('/alladvertiser',allAdvertiser)
managerRouter.put('/updateDataCampain/:id',updateDataCampain)
managerRouter.get('/singleAllCampaign/:id',singleAllCampaign)

managerRouter.get('/campaignCartData',campaignCart)
managerRouter.get("/siteCartData",getPublisherCart)
managerRouter.get("/singleAllpublisher/:id",singelAllPublisher)


managerRouter.post("/update-status/:id", statusUpdate)
managerRouter.get('/getsinglecampaign/:id',getSingleCampaignbyUser)
managerRouter.get('/getallcampaignsforadmin', getAllCampaignForAdmin)
managerRouter.delete('/delete-manager-site/:id',deleteManagerSite)
 


module.exports=managerRouter;