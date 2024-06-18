const multer = require('multer');


// User Profile Pic Image
const profileImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/image');
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()+"-"+Math.round(Math.random()*1E9);
      const path = 'IMG' + uniqueSuffix + "." + file.originalname.split(".")[1];
    cb(null, path);
  }
});
exports.profileImageUpload = multer({
  storage: profileImageStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
}).single('user_profile_image');

// User Profile Pic Image

const campaignImagesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/image');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = 'IMG' + uniqueSuffix + '.' + file.originalname.split('.')[1];
    cb(null, fileName);
  }
});

exports.campaignImagesUpload = multer({
  storage: campaignImagesStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
}).array('campaign_images', 3);

