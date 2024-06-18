const PublisherModal = require("../../models/publisher/publisherModal")
const SiteStoreModal = require("../../models/publisher/siteModal")

exports.getPublisherCart = async (req, res) => {
    try {

        const managerId = req.user.id


        const siteData = await PublisherModal.find({ managerId: managerId }).populate({
            path: "siteStore",
            model: SiteStoreModal
        })

        const approvel = siteData.map((ele) => {
            const totalSite = ele?.siteStore?.sites?.length
            const totalApprovel = ele.siteStore.sites.filter((aprove) => {
                return aprove.status === "approved"
            }).length

            const totalRejected = ele.siteStore.sites.filter((aprove) => {
                return aprove.status === "rejected"
            }).length

            return {
                ele,
                totalApprovel,
                totalSite,
                totalRejected
            }
        })

        if (approvel) {
            res.json({
                status: "success",
                data: approvel
            })
        } else {
            res.json({
                status: "failed"
            })
        }

    } catch (error) {
        res.json({
            status: "failed"
        })
    }
}


exports.singelAllPublisher = async (req, res) => {

    const publisherId = req.params.id
    console.log(publisherId)
    try {

        const allpublisher = await SiteStoreModal.findOne({ _id: publisherId }).populate({
            path: "publisherId",
            model: PublisherModal
        })
        if (allpublisher) {
            res.json({
                status: "success",
                message: "All Publisher",
                data: allpublisher
            })
        } else {
            res.json({
                status: "fail",
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

exports.deleteManagerSite = async (req, res) => {
    try {
        const managerId = req.user.id
        const storeId = req.params.id
        const deleteData = await SiteStoreModal.findOneAndUpdate({ managerId: managerId, 'sites.siteUniqueId': storeId }, { $pull: { sites: { siteUniqueId: storeId } } })

        if (deleteData) {
            res.json({
                status: "success",
                message: "Site Deleted"
            })
        } else {
            res.json({
                status: "fail",
                message: "Site not Deleted"
            })
        }
    }
    catch (error) {
        console.error(error)
    }
}

exports.updateManagerSiteData = async (req, res) => {
    try {
        const managerId = req.user.id
        const storeId = req.params.id
        const siteData = req.body

        const dataObj = {
            websiteUrl: siteData.websiteUrl,
            websiteName: siteData.websiteName,
            status: siteData.status,
            mainCategory: siteData.mainCategory,
            metaTagCode: siteData.metaTagCode
        }

        const updateData = await SiteStoreModal.findOneAndUpdate({ managerId: managerId, 'sites.siteUniqueId': storeId }, { $set: { "sites": dataObj } })
        if (updateData) {
            res.json({
                status: "success",
                message: "Site Updated"
            })
        } else {
            res.json({
                status: "fail",
                message: "Site not Updated"
            })
        }
    } catch (error) {
        console.error(error)
    }
}
