const mongoose = require("mongoose");
const Collection = require("../../config/collection");
require("../../config/db");

const adZone = new mongoose.Schema(
  {
    name: { type: String },
    zoneId: { type: Number },
    adFormat: { type: String },
    // script: { type: String },
    trackingCode: { type: String },
    advancedSettings: { floorCPM: { type: Number } },
    siteID: { type: Number },
    size: { type: String },
    siteLinkId: { type: mongoose.Schema.ObjectId },
    redirectCount: { type: Number },
  },
  { timestamps: true }
);

const adsZoneStore = new mongoose.Schema({
  managerId: { type: mongoose.Schema.ObjectId },
  publisherId: { type: mongoose.Schema.Types.ObjectId },
  adZones: [adZone],
});

const AdsZoneStoreModal = mongoose.model(
  Collection.AddZoneCreate,
  adsZoneStore
);
module.exports = AdsZoneStoreModal;
