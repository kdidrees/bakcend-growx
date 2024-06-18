const multer = require("multer");

const userProfilePic = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/image");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const path = "IMG" + uniqueSuffix + "." + file.originalname.split(".")[1];
    cb(null, path);
  },
});
exports.profilePicUpload = multer({
  storage: userProfilePic,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
}).single("userProfilePic");

const campaignImagesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/image");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName =
      "IMG" + uniqueSuffix + "." + file.originalname.split(".")[1];
    cb(null, fileName);
  },
});

exports.campaignImagesUpload = multer({
  storage: campaignImagesStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
}).array("createcampaign_images", 3);
