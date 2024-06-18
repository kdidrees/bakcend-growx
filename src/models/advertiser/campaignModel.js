const mongoose = require("mongoose");
require("../../config/db");
const Collection = require("../../config/collection");

const Schema = mongoose.Schema;

const CampaignSchema = new mongoose.Schema({
  status: { type: String },
  campainStart: { type: String },
  general: {
    campaignName: { type: String, required: true },
    adFormat: { type: String, required: true },
    feed: { type: Schema.Types.Mixed, required: true },
    creatives: { type: [String] },
    destinationURL: { type: String, required: true },
    afterVerification: { type: String, required: true },
    scheduledDateTime: { type: Date },
  },
  pricings: {
    pricingModel: { type: String, required: true },
    biddingValue: { type: Number, required: true },
    campaignBudget: { type: Number, required: true },
    dailyBudget: { type: Number, required: true },
  },
  targetings: {
    geo: { type: Schema.Types.Mixed, default: "All" },
    operatingSystem: { type: Schema.Types.Mixed, default: "All" },
    browser: { type: Schema.Types.Mixed, default: "All" },
    connectionType: { type: Schema.Types.Mixed, default: "All" },
    language: { type: Schema.Types.Mixed, default: "All" },
    ipRange: { type: Schema.Types.Mixed, default: "All" },
    devise: { type: Schema.Types.Mixed, default: "All" },
  },
  advanceSettings: {
    frequencyImpression: { type: Number },
    cappingImpression: { type: Number },
    frequencyClick: { type: Number },
    cappingClick: { type: Number },
    proxyFilter: { type: String },
    campaignSchedule: { type: Schema.Types.Mixed, default: "All" },
    postbackUrl: { type: String },
    buyingType: { type: String },
  },
  trafficStatus: {
    type: String,
    enum : ['ON','OFF'],
    default: 'OFF'
  }
});

const campaignStoreSchema = new mongoose.Schema(
  {
    advertiserId: { type: mongoose.SchemaTypes.ObjectId },
    managerId: { type: mongoose.SchemaTypes.ObjectId },
    campaigns: [CampaignSchema],
  },
  { timestamps: true }
);

const CampaignStoreModel = mongoose.model(
  Collection.CampaignStore,
  campaignStoreSchema
);

module.exports = CampaignStoreModel;
