const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Load environment variables

cloudinary.config({
  cloud_name: "dgbetanap",
  api_key: "313965364584214",
  api_secret: "Qg5wtqfrhhv1VirCYK5UCnfCHv4"
});

module.exports = cloudinary;
