const AdvertiserModal = require("../../models/advertiser/advertiserModel");
const CampaignStoreModel = require("../../models/advertiser/campaignModel");

// Create Campaign for advertiser
exports.createCampaign = async (req, res) => {
  try {
    const data = req.body;
    console.log(data)
    // console.log(JSON.stringify(req.body.general.creatives))
    const userId = req.user.id;
    const { general, pricings, targetings, advanceSettings } = data; 
    const newCampaign = {
      campainStart: data.campainStart,
      status: data.status,
      general: {
        campaignName: general.campaignName,
        adFormat: general.adFormat,
        feed: general.feed,
        //creatives: general.creatives,
        destinationURL: general.destinationURL,
        afterVerification: general.afterVerification,
        scheduledDateTime: general.scheduledDateTime,
      },
      pricings: {
        pricingModel: pricings.pricingModel,
        biddingValue: pricings.biddingValue,
        campaignBudget: pricings.campaignBudget,
        dailyBudget: pricings.dailyBudget,
      },
      targetings: {
        geo: targetings?.geo,
        operatingSystem: targetings?.operatingSystem,
        browser: targetings?.browser,
        connectionType: targetings?.connectionType,
        language: targetings?.language,
        ipRange: targetings?.ipRange,
      },
      advanceSettings: {
        frequencyImpression: advanceSettings?.frequencyImpression,
        cappingImpression: advanceSettings?.cappingImpression,
        frequencyClick: advanceSettings?.frequencyClick,
        cappingClick: advanceSettings?.cappingClick,
        proxyFilter: advanceSettings?.proxyFilter,
        campaignSchedule: advanceSettings?.campaignSchedule,
        postbackUrl: advanceSettings?.postbackUrl,
        buyingType: advanceSettings?.buyingType,
      }
    };
    const advertiserFindId = await AdvertiserModal.findOne({_id: userId});

    let campainStore = await CampaignStoreModel.findOne({ advertiserId: userId });
      campainStore.managerId =     advertiserFindId.managerId;
      await campainStore.save();

    if (campainStore) {

      campainStore.campaigns.push(newCampaign);
      await campainStore.save();

      res.json({
        status: "success",
        message:
          " Campaign created successfully", 
        
      });
    } else {
      res.json({
        status: "fail",
        message: "No Campaign Store Found",

      });
    }
  } catch (error) {
    console.error(error);
    const resError = {};
    resError.status = "failed";
    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      resError.error = errors;
    }
    res.json(resError);
  }
};

//Get Single Campaign By Campaign Id
exports.getCampaignById=async(req,res)=>{
  try{
  const campaignId=req.params.campaignId;
  const advertiserId=req.user.id;
  const campaignStore=await CampaignStoreModel.findOne({advertiserId:advertiserId});
  const foundCampaign=campaignStore.campaigns.find((campaign)=>campaign._id==campaignId)
  if(foundCampaign){
    res.status(200).json({
      message:"Campaign Found Successfully",
      campaign:foundCampaign
    })
  }
    else{
      res.status(404).json({
        message:"No Campaign Found",
      })
    }
  }
  catch(e){
    console.log(e.message)
     res.status(500).json({
      message:"Internal Server Error"
     })
  }
  

}

//Get Campaigns Linked AdvertiserID
exports.getCampaigns = async (req, res) => {
  try {
    const advertiserId = req.user.id;

    const campaignStore = await CampaignStoreModel.findOne({ advertiserId: advertiserId })

    if (campaignStore) {
      const campaigns=campaignStore.campaigns
      res.json({
        status: "success",
        message: "Campaigns Found successfully.",
        campaigns:campaigns,
      });
    } else {
      res.json({
        status: "fail",
        message: "No Campaign Found",
      });
    }
  } catch (error) {
    console.error(error);
    const resError = {
      status: "failed",
      message: "Error fetching user campaign.",
    };

    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      resError.error = errors;
    }

    res.json(resError);
  }
};

//Delete the Campaign (HARD)
exports.deleteCampaign = async (req, res) => {
  try {
    const userId = req.user.id;
    const campaignId = req.params.id;

    // Ensure userId and campaignId exist
    if (!campaignId) {
      return res.json({
        status: "fail",
        message: "Campaign ID is missing in the request.",
      });
    }

    // Find the user's document and update the array by pulling the specified campaignId
    const updatedCampaignStore = await CampaignStoreModel.findOneAndUpdate(
      { advertiserId: userId },
      { $pull: { campaigns: { _id: campaignId } } },
      { new: true }
    ).lean();
    console.log(updatedCampaignStore)
    if (updatedCampaignStore ) {
      const campaigns=updatedCampaignStore.campaigns;
      res.json({
        status: "success",
        message: "Campaign deleted successfully.",
        data: campaigns
        ,
      });
    } else {
      res.json({
        status: "fail",
        message: "Campaign not found or could not be deleted.",
      });
    }
  } catch (error) {
    console.error(error);
    const resError = {
      status: "failed",
      message: "Error deleting campaign.",
    };

    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      resError.error = errors;
    }

    res.json(resError);
  }
};


//Start and Pause the Campaign
exports.doStartorPauseCampaign=async(req,res)=>{
  try{
    const campaignId=req.params.campaignId;
    const advertiserId=req.user.id;
    const campaignStore=await CampaignStoreModel.findOne({advertiserId:advertiserId});
    const foundCampaign=campaignStore.campaigns.find((campaign)=>campaign._id==campaignId)
    if(foundCampaign){
      console.log(foundCampaign)
      if(foundCampaign.trafficStatus=='ON'){
        console.log("ON")
        foundCampaign.trafficStatus='OFF'
        await campaignStore.save();
        res.status(200).json({
          message:"Campaign Traffic Paused"
        })
       }
       else if(foundCampaign.trafficStatus=="OFF"){
        console.log('OFF')
        foundCampaign.trafficStatus='ON'
        await campaignStore.save();
        res.status(200).json({
          message:"Campaign Traffic Started"
        })
       }
       else{
        res.json({
          message:"Traffic Status neither is ON or OFF"
        })
       }
       
  }
   else{
    res.json({
      message:"Campaign not found"
    })
   }
}
  catch(e){
    res.json({
      message:"Internal Server Error"
    })
  }
}

//Don't Know 
exports.getSingleCampaignbyUser = async (req, res) => {
  try {
    const userId = req.params.id;
   
    // Ensure userId exists
    if (!userId) {
      return res.json({
        status: "fail",
        message: "User ID is missing in the request.",
      });
    }

    const userCampaign = await CampaignStoreModel.findOne({ advertiserId: userId })
      .populate({
        path: "user",
        model: AdvertiserModal,
        select: "fullName userName ",
      })
      .lean(); // Use lean() to get a plain JavaScript object
     
    const updatedCampaign = userCampaign.campaigns.map((ele) => {
      return {
        ...ele,
        createcampaign_images: ele?.createcampaign_images?.map((img) => img),
      };
    });
    userCampaign.campaigns = updatedCampaign;
    if (userCampaign) {
      res.json({
        status: "success",
        message: "Get Campaign successfully.",
        data: userCampaign,
      });
    } else {
      res.json({
        status: "fail",
        message: "No Campaign Found",
      });
    }
  } catch (error) {
    console.error(error);
    const resError = {
      status: "failed",
      message: "Error fetching user campaign.",
    };

    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      resError.error = errors;
    }

    res.json(resError);
  }
};


exports.updateCampaign = async (req, res) => {
  try {
    const advertiserId = req.user.id;
    const campaignId = req.params.campaignId
    const data = req.body;
   

    const updateData = await CampaignStoreModel.findOneAndUpdate(
      { advertiserId: advertiserId, "campaigns._id": campaignId },
      {
        $set: {
          "campaigns.$.general.campaignName": data.general.campaignName,
          "campaigns.$.general.adFormat": data.general.adFormat,
          "campaigns.$.general.feed": data.general.feed,
          "campaigns.$.general.creatives": data.general.creatives,
          "campaigns.$.general.destinationURL": data.general.destinationURL,
          "campaigns.$.general.afterVerification": data.general.afterVerification,
          "campaigns.$.general.scheduledDateTime": data.general.scheduledDateTime,
          "campaigns.$.pricings.pricingModel": data.pricings.pricingModel,
          "campaigns.$.pricings.biddingValue": data.pricings.biddingValue,
          "campaigns.$.pricings.campaignBudget": data.pricings.campaignBudget,
          "campaigns.$.pricings.dailyBudget": data.pricings.dailyBudget,
          "campaigns.$.targetings.geo": data.targetings?.geo,
          "campaigns.$.targetings.operatingSystem": data.targetings?.operatingSystem,
          "campaigns.$.targetings.browser": data.targetings?.browser,
          "campaigns.$.targetings.connectionType": data.targetings?.connectionType,
          "campaigns.$.targetings.language": data.targetings?.language,
          "campaigns.$.targetings.ipRange": data.targetings?.ipRange,
          "campaigns.$.advanceSettings.frequencyImpression": data.advanceSettings?.frequencyImpression,
          "campaigns.$.advanceSettings.cappingImpression": data.advanceSettings?.cappingImpression,
          "campaigns.$.advanceSettings.frequencyClick": data.advanceSettings?.frequencyClick,
          "campaigns.$.advanceSettings.cappingClick": data.advanceSettings?.cappingClick,
          "campaigns.$.advanceSettings.proxyFilter": data.advanceSettings?.proxyFilter,
          "campaigns.$.advanceSettings.campaignSchedule": data.advanceSettings?.campaignSchedule,
          "campaigns.$.advanceSettings.postbackUrl": data.advanceSettings?.postbackUrl,
          "campaigns.$.advanceSettings.buyingType": data.advanceSettings?.buyingType,
        }

      },
      { new: true }
    )

    if (updateData) {
      res.json({
        status: "success",
        message: "Update Success",
        data: updateData
      })
    } else {
      res.json({
        status: "false",
        message: "Update Fail"
      })
    }

  } catch (error) {
    console.log(error);
    const resError = {};
    resError.status = "failed";
    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      resError.error = errors;
    }
    res.json(resError);
  }
}

exports.viewCampainData = async (req, res) => {
  try {
    const user = req.user.id
    console.log(user);
    const userFinfById = await CampaignStoreModel.findOne({ advertiserId: user })

    if (userFinfById) {
      res.json({
        status: "success",
        data: userFinfById
      })
    } else {
      res.json({
        status: "failed",
      })
    }
  } catch (error) {
    console.log(error);
    const resError = {};
    resError.status = "failed";
    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      resError.error = errors;
    }
    res.json(resError);
  } 
}  

exports.campainDelete = async (req, res) => {
  try {
    const userId = req.user.id
    const campainId = req.params.id
    const deleteCampain = await CampaignStoreModel.findOneAndUpdate({ advertiserId: userId }, { $pull: { campaigns: { _id: campainId } } }, { new: true })
    if (deleteCampain) {
      res.json({
        status: "success", 
        message:"delete successfully"
      })
    } else {
      res.json({
        status: "failed"
      })
    }
  } catch (error) {
    console.log(error);
    const resError = {};
    resError.status = "failed";
    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      resError.error = errors;
    }
    res.json(resError);
  }
 
}