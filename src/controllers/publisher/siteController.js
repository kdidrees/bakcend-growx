const PublisherModal = require("../../models/publisher/publisherModal");
const SiteStoreModal = require("../../models/publisher/siteModal");
const { generateMetaContent } = require("../../utils/password");

exports.addMetaPublisher = async (req, res) => {
  try {
    const publisgerData = req.body;
    const publisherId = req.user.id;

    let siteUniqueId = Math.floor(1000 + Math.random() * 9000);
    for (let i = 0; i < 1000; i++) {
      let findPublisher = await SiteStoreModal.findOne({
        publisherId: publisherId,
        "sites.siteUniqueId": siteUniqueId,
      });
      if (findPublisher) {
        siteUniqueId = Math.floor(1000 + Math.random() * 9000);
      } else {
        break;
      }
    }

    const publisherData = {
      publisherId: publisherId,
      sites: {
        websiteUrl: publisgerData.websiteUrl,
        websiteName: publisgerData.websiteName,
        status: "pending",
        mainCategory: publisgerData.mainCategory,
        metaTagCode: generateMetaContent(),
        siteUniqueId: siteUniqueId,
      },
    };

    let findPublisher = await SiteStoreModal.findOne({
      publisherId: publisherId,
    });

    if (!findPublisher) {
      let ress = await SiteStoreModal.create(publisherData);
      let publisherFindId = await PublisherModal.findOne({ _id: publisherId });
      ress.managerId = publisherFindId.managerId;
      await ress.save();
    } else {
      const ress = await SiteStoreModal.findOneAndUpdate(
        { publisherId: publisherId },
        { $push: { sites: publisherData.sites } }
      );
    }

    if (findPublisher) {
      res.json({
        status: "success",
        message: "Meta Tag Added",
      });
    } else {
      res.json({
        status: "failed",
        message: "Meta Tag not Added",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getMetaPublisherMetatag = async (req, res) => {
  try {
    const publisherId = req.user.id;

    const uniqueId = req.params.id;

    let ress = await SiteStoreModal.findOne({
      publisherId: publisherId,
    }).select({ sites: { $elemMatch: { siteUniqueId: uniqueId } } });

    const site = ress.sites[0];

    // aggrigate find publisher id and site id

    console.log(ress);
    if (ress) {
      res.json({
        status: "success",
        message: "Meta Tag",
        data: site.metaTagCode,
      });
    } else {
      res.json({
        status: "failed",
        message: "Meta Tag not found",
      });
    }
  } catch (error) {
    console.error(error);
  }
};

exports.frontendAllPublisher = async (req, res) => {
  try {
    const publisherId = req.user.id;

    const allpublisher = await SiteStoreModal.findOne({
      publisherId: publisherId,
    });

    const showData = allpublisher.sites.map((item) => {
      return {
        websiteUrl: item.websiteUrl,
        websiteName: item.websiteName,
        status: item.status,
        mainCategory: item.mainCategory,
        siteUniqueId: item.siteUniqueId,
        _id: item._id,
        createdAt: item.createdAt
      };
    });

    if (allpublisher) {
      res.json({
        status: "success",
        message: "All Publisher",
        data: showData,
      });
    } else {
      res.json({
        status: "failed",
        message: "Publisher not found",
      });
    }
  } catch (error) {}
};

exports.statusUpdate = async (req, res) => {
  try {
    const managerId = req.user.id;

    const storeId = req.params.id;

    const status = req.body.status;

    const updateData = await SiteStoreModal.findOneAndUpdate(
      { managerId: managerId, "sites._id": storeId },
      { $set: { "sites.$.status": status } }
    );

    if (updateData) {
      res.json({
        status: "success",
      });
    } else {
      res.json({
        status: "fail",
      });
    }
  } catch (error) {
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

exports.deleteSite = async (req, res) => {
  try {
    const publisherId = req.user.id;
    const storeId = req.params.id;
    const deleteData = await SiteStoreModal.findOneAndUpdate(
      { publisherId: publisherId, "sites.siteUniqueId": storeId },
      { $pull: { sites: { siteUniqueId: storeId } } }
    );

    if (deleteData) {
      res.json({
        status: "success",
        message: "Site Deleted",
      });
    } else {
      res.json({
        status: "fail",
        message: "Site not Deleted",
      });
    }
  } catch (error) {
    console.error(error);
  }
};

exports.updatePublisherSiteData = async (req, res) => {
  try {
    const publisherId = req.user.id;
    const storeId = req.params.id;
    const siteData = req.body;

    const updateFind = await SiteStoreModal.findOne({
      publisherId: publisherId,
      "sites.siteUniqueId": storeId,
    });
    if (updateFind.websiteUrl == siteData.websiteUrl) {
      let dataObj = {
        websiteUrl: siteData.websiteUrl,
        websiteName: siteData.websiteName,
      };

      var updateDataItem = await SiteStoreModal.findOneAndUpdate(
        { publisherId: publisherId, "sites.siteUniqueId": storeId },
        {
          $set: {
            "sites.$.websiteUrl": siteData.websiteUrl,
            "sites.$.websiteName": siteData.websiteName,
            "sites.$.status": siteData.status,
            "sites.$.mainCategory": siteData.mainCategory,
            "sites.$.uniqueId": updateFind.uniqueId,
          },
        }
      );
    } else {
      let dataObj = {
        websiteUrl: siteData.websiteUrl,
        websiteName: siteData.websiteName,
        status: "pending",
        metaTagCode: generateMetaContent(),
      };
      var updateDataite = await SiteStoreModal.findOneAndUpdate(
        { publisherId: publisherId, "sites.siteUniqueId": storeId },
        {
          $set: {
            "sites.$.websiteUrl": siteData.websiteUrl,
            "sites.$.websiteName": siteData.websiteName,
            "sites.$.status": "pending",
            "sites.$.mainCategory": siteData.mainCategory,
            "sites.$.metaTagCode": generateMetaContent(),
            "sites.$.uniqueId": updateFind.uniqueId,
          },
        }
      );
    }

    if (updateDataItem || updateDataite) {
      res.json({
        status: "success",
        message: "Site Updated",
      });
    } else {
      res.json({
        status: "fail",
        message: "Site not Updated",
      });
    }
  } catch (error) {
    console.error(error);
  }
};

exports.getSingleSiteData = async (req, res) => {
  try {
    const publisherId = req.user.id;
    const siteId = req.params.id;

    const getData = await SiteStoreModal.findOne({
      publisherId: publisherId,
    }).select({ sites: { $elemMatch: { _id: siteId } } });
    const singleSiteData = getData.sites.flat(1);
    const [destruchure] = singleSiteData;
    if (getData) {
      res.json({
        status: "success",
        data: destruchure,
      });
    } else {
      res.json({
        status: "fail",
      });
    }
  } catch (error) {
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

exports.updateSingleSiteData = async (req, res) => {
  try {
    const publisherId = req.user.id;

    const siteId = req.params.id;
    const siteData = req.body;
    console.log(siteData);

    const getData = await SiteStoreModal.findOneAndUpdate(
      {
        publisherId: publisherId,
        "sites._id": siteId,
      },
      {
        $set: {
          "sites.$.websiteUrl": siteData.websiteUrl,
          "sites.$.websiteName": siteData.websiteName,
          "sites.$.status": siteData.status,
          "sites.$.mainCategory": siteData.mainCategory,
        },
      }
    );
    console.log(getData);

    if (getData) {
      res.json({
        status: "success",
        message: "update successfully",
        data: getData,
      });
    } else {
      res.json({
        status: "fail",
        message: "Site not Updated",
      });
    }
  } catch (error) {}
};
