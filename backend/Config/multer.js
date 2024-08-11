const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve(__dirname, "..", "..", "tmp", "uploads");
console.log("UPLOAD_DIR", UPLOAD_DIR,"process en ",process.env.UPLOAD_DIR);
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${Date.now()}-${name}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        "image/jpeg",
        "image/pjpeg",
        "image/png",
        "image/gif",
        "video/mp4",
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"));
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE
    },
    fileFilter
});

module.exports = upload;