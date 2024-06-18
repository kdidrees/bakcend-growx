const express = require('express');



const { publisherLogin, publisherSignup, getProfile } = require('../controllers/publisher/publisherController');
const { addMetaPublisher, getMetaPublisherMetatag, statusUpdate, frontendAllPublisher, deleteSite, updatePublisherSiteData, getSingleSiteData, updateSingleSiteData } = require('../controllers/publisher/siteController');

const { authmidleware } = require('../middleware/authenticationMiddleWare');
const { addZonecreate, getZoneurl, getAllAddZone, approvedStatus } = require('../controllers/publisher/addZoneController');
 

const publisherRouter = express.Router()
// Admin Auth pp
publisherRouter.post('/publisherlogin', publisherLogin)
publisherRouter.post('/publishersignup', publisherSignup)




//User Profile

publisherRouter.get("/profile", authmidleware, getProfile)

publisherRouter.get('/getZoneurl',getZoneurl)




publisherRouter.use(authmidleware)
publisherRouter.post("/meta-tag-add", addMetaPublisher)
publisherRouter.get("/meta-tag-get/:id", getMetaPublisherMetatag)
publisherRouter.get("/all-site-Data", frontendAllPublisher),
publisherRouter.delete('/delete-site/:id',deleteSite)
publisherRouter.put("/update-Site-Data-Publisher/:id", updatePublisherSiteData)

//https://go.growtrackad.online/pop.go?spaceid=11634676&subid=

// add zone

// site 

publisherRouter.get("/get-Single-SiteData/:id",getSingleSiteData)
publisherRouter.put("/update-Single-SiteData/:id",updateSingleSiteData)



publisherRouter.post('/add-zonead',addZonecreate)
publisherRouter.get('/get-allAddzone',getAllAddZone)
publisherRouter.get('/get-allAddzoneStatus',approvedStatus)

module.exports = publisherRouter;