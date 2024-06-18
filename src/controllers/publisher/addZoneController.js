const CampaignStoreModel = require("../../models/advertiser/campaignModel");
const PublisherModal = require("../../models/publisher/publisherModal");
const AdsZoneStoreModal = require("../../models/publisher/scriptModal");
const SiteStoreModal = require("../../models/publisher/siteModal");
const {
  scriptTagGenerater,
  generateUniqueSignupID,
} = require("../../utils/password");

exports.addZonecreate = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const publiserId = req.user.id;
    const existingAdZoneStore = await AdsZoneStoreModal.findOne({
      publisherId: publiserId,
    });

    if (existingAdZoneStore) {
      const newAdZone = {
        // script: scriptTagGenerater(),
        zoneId: generateUniqueSignupID([]),
        adFormat: data.adFormat,
        name: data.name,
        // trackingCode: data.trackingCode,
        advancedSettings: data.advancedSettings,
        siteID: data.siteID,
        size: data.size,

        siteLinkId: data.siteLinkId,
      };

      existingAdZoneStore.adZones.push({ ...newAdZone });
      await existingAdZoneStore.save();
      res.json({
        status: "success",
        message: "Add Zone Created Successfully",
      });
    } else {
      const newAdZoneStore = await AdsZoneStoreModal.create({
        publisherId: publiserId,
        adZones: [],
      });
      const newAdZone = {
        // script: scriptTagGenerater(),
        // zoneId: generateUniqueSignupID([]),
        adFormat: data.adFormat,
        // trackingCode: data.trackingCode,
        advancedSettings: data.advancedSettings,
        siteID: data.siteID,
        size: data.size,
      };
      newAdZoneStore.adZones.push(newAdZone);
      await newAdZoneStore.save();
      res.json({
        status: "success",
        message: "Add Zone Created Successfully",
      });
    }
  } catch (error) {
    console.error(error);
  }
};

exports.getAllAddZone = async (req, res) => {
  try {
    const publisherId = req.user.id;

    const findZone = await AdsZoneStoreModal.findOne({
      publisherId: publisherId,
    });

    if (findZone) {
      res.json({
        status: "success",
        data: findZone,
      });
    } else {
      res.json({
        status: "fail",
      });
    }
  } catch (error) {}
};

exports.getZoneurl = async (req, res) => {
  // const script = req.params.id
  const forverdingData = req.query;
  const { pop: findPublisher, skieid: findScipeId } = forverdingData;

  try {
    let findScript = await AdsZoneStoreModal.find({});
    let array = [];
    let dataa = findScript.map((ele) => {
      let getValue = ele._id;

      array.push(getValue.toString().split("").splice(17, 24).join(""));

      let idVal = ele.publisherId.toString().split("").splice(17, 24).join("");
      if (idVal == findPublisher) {
        let redirect = ele.adZones.filter((ele) => ele.zoneId == findScipeId);
        return redirect;
      }
    });

    const [destruchure] = dataa;
    const [destruch] = destruchure;
    console.log(destruch.url);

    if (destruch) {
      res.redirect(destruch.url);
    } else {
      res.json({
        status: "fail",
      });
    }
  } catch (error) {
    console.error(error);
  }
};

exports.updateAddZone = async (req, res) => {
  try {
    const zoneId = req.params.id;
    const publisherId = req.user.id;
    const zoneData = req.body;

    const update = {
      // managerId: publisherId.managerId,
      publisherId: publisherId,
      adZones: [
        {
          script: scriptTagGenerater(),
          zoneId: generateUniqueSignupID([]),
          adFormat: zoneData.adFormat,
          trackingCode: zoneData.trackingCode,
          advancedSetting: {
            floorCPM: zoneData.floorCPM,
          },
          url: zoneData.url,

          size: zoneData.size,
        },
      ],
    };

    const updateData = await AdsZoneStoreModal.findOneAndUpdate(
      { publisherId: publisherId, "adZones._id": zoneId },
      {
        $set: {
          "adZones.$.adFormat": zoneData.adFormat,
        },
      }
    );
  } catch (error) {}
};

exports.approvedStatus = async (req, res) => {
  try {
    const publisherId = req.user.id;

    const findZone = await SiteStoreModal.findOne({
      publisherId: publisherId,
    });

    let arraySet = [];
    for (let i = 0; i < findZone.sites.length; i++) {
      if (findZone.sites[i].status == "approved") {
        // findZone.sites[i].status = "approved"
        arraySet.push({
          url: findZone.sites[i].websiteUrl,
          _id: findZone.sites[i]._id,
        });
      }
    }

    if (findZone) {
      res.json({
        status: "success",
        data: arraySet,
      });
    } else {
      res.json({
        status: "fail",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getPublisherMatchCategory = async (req, res) => {
  try {
    console.log(req.query)
    const {skipeId,addZone} = req.query;
    

    const forverdUrl = await CampaignStoreModel.find({});
    let zoneIdFind = await AdsZoneStoreModal.find({});
    let findsiteId = await SiteStoreModal.find({});

    let zonesetredirect = {};
    zoneIdFind.filter((ele) =>
      ele.adZones.map((zone) => {
        if (zone.zoneId === parseInt(skipeId)) {
          findsiteId.map((ele) => {
            ele.sites.map((urlSiteId) => {
              // if (zone.siteLinkId.toString("") === urlSiteId._id.toString("")) {
                // url
                forverdUrl.map((ele) => {
                  ele.campaigns.map((zoneCheck) => {
                    if (zoneCheck.general.adFormat === addZone) {
                      if (urlSiteId.mainCategory == zoneCheck.general.feed) {
                        res.redirect(zoneCheck.general.destinationURL);
                      }
                    } else {
                      res.json({
                        status: "no found",
                      });
                    }
                  });
                });
              // }
            });
          });
        }
      })
    );
  } catch (error) {}
};
