const { path } = require("../../../app");
const AdvertiserModal = require("../../models/advertiser/advertiserModel");
const CampaignStoreModel = require("../../models/advertiser/campaignModel");
const CreateCampaignModal = require("../../models/advertiser/campaignModel");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


exports.getAllCampaigns = async (req, res) => {
  try {
    // const managerId = req.user.id;
    // Fetch all campaigns and populate user details
    const userCampaigns = await CreateCampaignModal.find({})
      .populate({
        path: "user",
        model: AdvertiserModal,
        select: "fullName userName ",
      })
      .lean();

    const modifiedUserampaigns = userCampaigns.map((user) => {
      const totalCampaigns = user.campaigns.length;
      const approvedCampaigns = user.campaigns.filter((campaign) => {
        return campaign.campaignStatus == "approved";
      }).length;
      const rejectedCampaigns = user.campaigns.filter((campaign) => {
        return campaign.campaignStatus == "rejected";
      }).length;
      return {
        user: user.user,
        totalCampaigns,
        rejectedCampaigns,
        approvedCampaigns,
      };
    });

    if (userCampaigns.length > 0) {
      res.json({
        status: "success",
        message: "Get Campaigns successfully.",
        data: modifiedUserampaigns,
      });
    } else {
      res.json({
        status: "fail",
        message: "No Campaigns Found",
      });
    }
  } catch (error) {
    console.error(error);
    const resError = {
      status: "failed",
      message: "Error fetching campaigns.",
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
exports.getAllCampaignForAdmin = async (req, res) => {
  try {
    // Fetch all campaigns and populate user details
    const userCampaigns = await CreateCampaignModal.find({})
      .populate({
        path: "user",
        model: AdvertiserModal,
        select: "fullName userName ",
      })
      .lean(); // Adding clean() to convert Mongoose documents to plain JavaScript objects
    const campaigns = userCampaigns.map((ele1) =>
      ele1.campaigns.map((ele) => {
        return { ...ele, user: ele1.user };
      })
    );

    if (campaigns.length > 0) {
      res.json({
        status: "success",
        message: "Get Campaigns successfully.",

        user: campaigns,
      });
    } else {
      res.json({
        status: "fail",
        message: "No Campaigns Found",
      });
    }
  } catch (error) {
    console.error(error);
    const resError = {
      status: "failed",
      message: "Error fetching campaigns.",
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


///// code start /////


exports.allAdvertiser = async (req, res) => {
  const manager_id = req.user.id
  try {
    const allAdvertiser = await AdvertiserModal.find({ managerId: manager_id }).populate({
      path: "campaignStore",
      model: CampaignStoreModel,
    })
    if (allAdvertiser) {
      res.json({
        status: "success",
        message: "All Advertiser",
        data: allAdvertiser
      })
    } else {
      res.json({
        status: "success",
        message: "No Data Found",
      })
    }

  }
  catch (error) {
    console.error(error)
    const resError = {
      status: "failed",
      message: "Error fetching Advertiser.",
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
}

exports.singleCampaignById=async(req,res)=>{
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
exports.updateDataCampain = async (req, res) => {
  try {
    const managerId = req.user.id
    const campainIid = req.params.id
    const data = req.body
    const findAndUpdate = await CampaignStoreModel.findOneAndUpdate({ managerId: managerId, "campaigns._id": campainIid }, {
      $set: {
        "campaigns.$.general.campaignName": data.general.campaignName,
        "campaigns.$.general.adFormat": data.general.adFormat,
        "campaigns.$.general.feed": data.general.feed,
        "campaigns.$.general.creatives": data.general.creatives,
        "campaigns.$.general.destinationURL": data.general.destinationURL,
        "campaigns.$.general.afterVerification": data.general.afterVerification,
        "campaigns.$.general.scheduledDateTime": data.general.scheduledDateTime,
        "campaigns.$.pricings.pricingType": data.pricings.pricingType,
        "campaigns.$.pricings.biddingValue": data.pricings.biddingValue,
        "campaigns.$.pricings.campaignBudget": data.pricings.campaignBudget,
        "campaigns.$.pricings.dailyBudget": data.pricings.dailyBudget,
        "campaigns.$.targetings.geo": data.targetings.geo,
        "campaigns.$.targetings.operatingSystem": data.targetings.operatingSystem,
        "campaigns.$.targetings.browser": data.targetings.browser,
        "campaigns.$.targetings.connectionType": data.targetings.connectionType,
        "campaigns.$.targetings.language": data.targetings.language,
        "campaigns.$.targetings.ipRange": data.targetings.ipRange,
        "campaigns.$.advanceSettings.frequencyImpression": data.advanceSettings.frequencyImpression,
        "campaigns.$.advanceSettings.cappingImpression": data.advanceSettings.cappingImpression,
        "campaigns.$.advanceSettings.frequencyClick": data.advanceSettings.frequencyClick,
        "campaigns.$.advanceSettings.cappingClick": data.advanceSettings.cappingClick,
        "campaigns.$.advanceSettings.proxyFilter": data.advanceSettings.proxyFilter,
        "campaigns.$.advanceSettings.campaignSchedule": data.advanceSettings.campaignSchedule,
        "campaigns.$.advanceSettings.postbackUrl": data.advanceSettings.postbackUrl,
        "campaigns.$.advanceSettings.buyingType": data.advanceSettings.buyingType,
        "campaigns.$.status": data.status
      }
    })

    if (findAndUpdate) {
      res.json({
        status: "success",
        message: "Updated SuccessFully",
      })
    } else {
      res.json({
        status: "failed",
        message: "Not Updated",

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


exports.singleAllCampaign = async (req, res) => {
  const managerId = req.user.id
  const campaignId = req.params.id
  try {

    const singleCampaign = await CampaignStoreModel.findOne({ _id: campaignId })
    if (singleCampaign) {
      res.json({
        status: "success",
        message: "All Advertiser",
        data: singleCampaign
      })
    } else {
      res.json({
        status: "success",
        message: "No Data Found",
      })
    }
  }
  catch (error) {
    console.error(error)
    const resError = {
      status: "failed",
      message: "Error fetching Advertiser.",
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
}


exports.campaignCart = async (req, res) => {
  try {
    const managerId = req.user.id
    

    let campaignData = await AdvertiserModal.find({ managerId: managerId }).populate({
      path: "campaignStore",
      model: CampaignStoreModel,
    })
    const modifiedUserampaigns = campaignData?.map((ele) => { 
      const totalCampains = ele?.campaignStore?.campaigns?.length
      const approvedCampains = ele?.campaignStore?.campaigns?.filter((campai) => {
        return campai?.campainStart == "active"
      }).length

      const reajectedCampian = ele.campaignStore?.campaigns?.filter((campai) => {
        return campai?.campainStart == "inactive"
      }).length

      return {
        ele,
        totalCampains,
        approvedCampains,
        reajectedCampian,
      }
    })



    if (modifiedUserampaigns) {
      res.json({
        status: "success",
        message: "All Advertiser",
        data: modifiedUserampaigns
      })
    } else {
      res.json({
        status: "success",
        message: "No Data Found",
      })
    }
  } catch (error) {
    console.error(error)
    const resError = {
      status: "failed",
      message: "Error fetching Advertiser.",
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
}


