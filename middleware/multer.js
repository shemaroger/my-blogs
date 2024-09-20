const multer = require('multer');
const path = require('path');

// Define the allowed file types for image uploads
const filetypes = /jpeg|jpg|png/;

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set the directory for file uploads
        cb(null, path.join(__dirname, 'public/uploads')); // Ensure 'public/uploads' exists or handle errors if it doesn't
    },
    filename: function (req, file, cb) {
        // Create a unique filename with a timestamp and the original file extension
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

// Initialize multer with storage, file size limit, and file type filter
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
    fileFilter: fileFilter, // Apply the file filter for validation
});

// Export the configured multer instance
module.exports = upload;
