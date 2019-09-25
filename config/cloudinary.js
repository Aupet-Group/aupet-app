const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = cloudinaryStorage({
  cloudinary,
  use_filename: true,
  folder: 'aupet-app/images', // Cloudinary folder name
  allowedFormats: ['jpg', 'png'],
  filename({req, res }, file, cb) {
    cb(null, res.locals.currentUser.fileName);
    // The file on cloudinary would have the same name as the original file name
  },
});

const upload = multer({ storage });

module.exports = upload;
