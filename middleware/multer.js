// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadPath = path.resolve(__dirname, '../uploads'); 
//         if (!fs.existsSync(uploadPath)){
//             fs.mkdirSync(uploadPath);
//         }
//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         cb(null,(file.originalname)); // Append the file's extension
//     }
// });

// const upload = multer({ storage });

// module.exports = upload;


const multer = require("multer");

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 32 * 1024 * 1024, // 100MB limit
    },
});

module.exports = upload;