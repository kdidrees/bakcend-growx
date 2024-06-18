const mongoose = require("mongoose");
const Collection = require("../../config/collection");
require("../../config/db");


const publisherSiteSchema = new mongoose.Schema({
    websiteUrl: { type: String },
    websiteName: { type: String },
    status: { type: String },
    mainCategory: { type: String },
    metaTagCode: { type: String },
    siteUniqueId: { type: Number },
},
{
    timestamps: true
}
)
 
const SiteStoreSchema = new mongoose.Schema({
    managerId: { type: mongoose.SchemaTypes.ObjectId },
    publisherId: {
        type: mongoose.Schema.Types.ObjectId,

    },
   sites:{type:[publisherSiteSchema]},

},
    { timestamps: true }
)

const SiteStoreModal = mongoose.model(Collection.PublisherSite, SiteStoreSchema);

module.exports = SiteStoreModal;