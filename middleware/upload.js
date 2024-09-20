const multer = require('multer');
const path = require('path');

// Define the allowed file types for image uploads
const filetypes = /jpeg|jpg|png/;

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/uploads')); // Ensure 'public/uploads' exists
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
    }
});

// File filter to restrict file types to JPEG and PNG
const fileFilter = (req, file, cb) => {
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only JPEG, JPG, and PNG files are allowed.'));
    }
};

// Initialize multer with storage and file filter
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
    fileFilter: fileFilter,
});

// Export the configured multer instance
module.exports = upload;
