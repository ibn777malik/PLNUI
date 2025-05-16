// backend/routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const imageController = require('../controllers/imageController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store files temporarily in the uploads/temp directory
    cb(null, 'uploads/temp');
  },
  filename: function (req, file, cb) {
    // Use a temporary filename with the original extension
    const extension = file.originalname.split('.').pop();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension}`);
  }
});

// File filter to allow only images and JSON
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/json') {
    cb(null, true);
  } else {
    cb(new Error('Only image and JSON files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// Get all images
router.get('/', imageController.getAllImages);

// Get images for a specific property
router.get('/property/:propertyId', imageController.getPropertyImages);

// Add a new image to a property (file upload)
router.post('/property/:propertyId/upload', upload.single('image'), imageController.addPropertyImage);

// Add a new image to a property (URL)
router.post('/property/:propertyId/url', imageController.addPropertyImageUrl);

// Update an image
router.put('/property/:propertyId/image/:imageId', imageController.updatePropertyImage);

// Delete an image
router.delete('/property/:propertyId/image/:imageId', imageController.deletePropertyImage);

// Bulk upload images
router.post('/property/:propertyId/bulk', upload.array('images', 20), imageController.bulkUploadImages);

// Import images from JSON
router.post('/import', upload.single('jsonFile'), imageController.importImages);

// Export images to JSON
router.get('/export', imageController.exportImages);

// Reorder images for a property
router.put('/property/:propertyId/reorder', imageController.reorderPropertyImages);

module.exports = router;