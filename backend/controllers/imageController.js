const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Path to the images data file
const imagesDataPath = path.join(__dirname, '../data/property_images.json');
const uploadsDir = path.join(__dirname, '../uploads/properties');

// Helper to read images data
const readImagesData = () => {
  try {
    if (!fs.existsSync(imagesDataPath)) {
      return { property_images: [] };
    }
    const data = fs.readFileSync(imagesDataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading images data:', error);
    return { property_images: [] };
  }
};

// Helper to write images data
const writeImagesData = (data) => {
  try {
    const dirPath = path.dirname(imagesDataPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(imagesDataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing images data:', error);
    return false;
  }
};

// Helper to ensure property directory exists
const ensurePropertyDir = (propertyId) => {
  const propertyDir = path.join(uploadsDir, propertyId);
  const originalDir = path.join(propertyDir, 'original');
  const thumbnailsDir = path.join(propertyDir, 'thumbnails');
  
  if (!fs.existsSync(propertyDir)) {
    fs.mkdirSync(propertyDir, { recursive: true });
  }
  
  if (!fs.existsSync(originalDir)) {
    fs.mkdirSync(originalDir);
  }
  
  if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir);
  }
  
  return { propertyDir, originalDir, thumbnailsDir };
};

// Get all images
exports.getAllImages = (req, res) => {
  try {
    const data = readImagesData();
    res.status(200).json({ success: true, images: data.property_images });
  } catch (error) {
    console.error('Error in getAllImages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch images', error: error.message });
  }
};

// Get images for a property
exports.getPropertyImages = (req, res) => {
  try {
    const { propertyId } = req.params;
    const data = readImagesData();
    const images = data.property_images.filter(img => img.propertyId === propertyId);
    res.status(200).json({ success: true, images });
  } catch (error) {
    console.error('Error in getPropertyImages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch images', error: error.message });
  }
};

// Add a new image to a property (file upload)
exports.addPropertyImage = (req, res) => {
  try {
    const { propertyId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
    
    const { originalDir, thumbnailsDir } = ensurePropertyDir(propertyId);
    const file = req.file;
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const imageId = `img-${uuidv4()}`;
    const filename = `${imageId}${fileExtension}`;
    
    const filePath = path.join(originalDir, filename);
    console.log(`Moving uploaded file from ${file.path} to ${filePath}`);
    fs.renameSync(file.path, filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error(`File not found after move: ${filePath}`);
      return res.status(500).json({ success: false, message: 'Failed to save image file' });
    }
    
    const thumbnailPath = path.join(thumbnailsDir, `thumb-${filename}`);
    console.log(`Creating thumbnail at ${thumbnailPath}`);
    fs.copyFileSync(filePath, thumbnailPath);
    
    if (!fs.existsSync(thumbnailPath)) {
      console.error(`Thumbnail not found after creation: ${thumbnailPath}`);
      return res.status(500).json({ success: false, message: 'Failed to create thumbnail' });
    }
    
    const data = readImagesData();
    const newImage = {
      id: imageId,
      propertyId,
      url: `/Uploads/properties/${propertyId}/original/${filename}`,
      thumbnailUrl: `/Uploads/properties/${propertyId}/thumbnails/thumb-${filename}`,
      description: req.body.description || '',
      timestamp: new Date().toISOString(),
      order: data.property_images.filter(img => img.propertyId === propertyId).length + 1,
      type: req.body.type || 'exterior',
      metadata: {
        filename: filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      }
    };
    
    data.property_images.push(newImage);
    
    console.log(`Writing image data to ${imagesDataPath}`);
    if (writeImagesData(data)) {
      console.log(`Successfully added image: ${newImage.url}`);
      res.status(201).json({ success: true, image: newImage });
    } else {
      console.error('Failed to write image data');
      res.status(500).json({ success: false, message: 'Failed to save image data' });
    }
  } catch (error) {
    console.error('Error in addPropertyImage:', error);
    res.status(500).json({ success: false, message: 'Failed to add image', error: error.message });
  }
};

// Add a new image by URL
exports.addPropertyImageUrl = (req, res) => {
  try {
    const { propertyId } = req.params;
    const { url, description } = req.body;
    
    if (!url) {
      return res.status(400).json({ success: false, message: 'Image URL is required' });
    }
    
    const data = readImagesData();
    const imageId = `img-${uuidv4()}`;
    
    const newImage = {
      id: imageId,
      propertyId,
      url,
      thumbnailUrl: url,
      description: description || '',
      timestamp: new Date().toISOString(),
      order: data.property_images.filter(img => img.propertyId === propertyId).length + 1,
      type: req.body.type || 'exterior',
      metadata: {
        source: 'url'
      }
    };
    
    data.property_images.push(newImage);
    
    if (writeImagesData(data)) {
      console.log(`Successfully added image by URL: ${newImage.url}`);
      res.status(201).json({ success: true, image: newImage });
    } else {
      console.error('Failed to write image data');
      res.status(500).json({ success: false, message: 'Failed to save image data' });
    }
  } catch (error) {
    console.error('Error in addPropertyImageUrl:', error);
    res.status(500).json({ success: false, message: 'Failed to add image by URL', error: error.message });
  }
};

// Update an image's details
exports.updatePropertyImage = (req, res) => {
  try {
    const { propertyId, imageId } = req.params;
    const { description } = req.body;
    const data = readImagesData();
    
    const imageIndex = data.property_images.findIndex(
      img => img.propertyId === propertyId && img.id === imageId
    );
    
    if (imageIndex === -1) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    
    data.property_images[imageIndex] = {
      ...data.property_images[imageIndex],
      description: description || data.property_images[imageIndex].description
    };
    
    if (writeImagesData(data)) {
      res.status(200).json({ success: true, image: data.property_images[imageIndex] });
    } else {
      res.status(500).json({ success: false, message: 'Failed to update image data' });
    }
  } catch (error) {
    console.error('Error in updatePropertyImage:', error);
    res.status(500).json({ success: false, message: 'Failed to update image', error: error.message });
  }
};

// Delete an image
exports.deletePropertyImage = (req, res) => {
  try {
    const { propertyId, imageId } = req.params;
    const data = readImagesData();
    
    const imageIndex = data.property_images.findIndex(
      img => img.propertyId === propertyId && img.id === imageId
    );
    
    if (imageIndex === -1) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    
    const image = data.property_images[imageIndex];
    if (image.metadata.filename) {
      const filePath = path.join(__dirname, '../Uploads/properties', propertyId, 'original', image.metadata.filename);
      const thumbnailPath = path.join(__dirname, '../Uploads/properties', propertyId, 'thumbnails', `thumb-${image.metadata.filename}`);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }
    
    data.property_images.splice(imageIndex, 1);
    
    if (writeImagesData(data)) {
      res.status(200).json({ success: true, message: 'Image deleted' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to delete image data' });
    }
  } catch (error) {
    console.error('Error in deletePropertyImage:', error);
    res.status(500).json({ success: false, message: 'Failed to delete image', error: error.message });
  }
};

// Bulk upload images
exports.bulkUploadImages = (req, res) => {
  try {
    const { propertyId } = req.params;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files uploaded' });
    }
    
    const { originalDir, thumbnailsDir } = ensurePropertyDir(propertyId);
    const data = readImagesData();
    const newImages = [];
    
    files.forEach((file, index) => {
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const imageId = `img-${uuidv4()}`;
      const filename = `${imageId}${fileExtension}`;
      
      const filePath = path.join(originalDir, filename);
      fs.renameSync(file.path, filePath);
      
      const thumbnailPath = path.join(thumbnailsDir, `thumb-${filename}`);
      fs.copyFileSync(filePath, thumbnailPath);
      
      const newImage = {
        id: imageId,
        propertyId,
        url: `/Uploads/properties/${propertyId}/original/${filename}`,
        thumbnailUrl: `/Uploads/properties/${propertyId}/thumbnails/thumb-${filename}`,
        description: req.body.descriptions ? req.body.descriptions[index] || '' : '',
        timestamp: new Date().toISOString(),
        order: data.property_images.filter(img => img.propertyId === propertyId).length + 1 + index,
        type: req.body.types ? req.body.types[index] || 'exterior' : 'exterior',
        metadata: {
          filename: filename,
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype
        }
      };
      
      newImages.push(newImage);
      data.property_images.push(newImage);
    });
    
    if (writeImagesData(data)) {
      res.status(201).json({ success: true, images: newImages });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save image data' });
    }
  } catch (error) {
    console.error('Error in bulkUploadImages:', error);
    res.status(500).json({ success: false, message: 'Failed to upload images', error: error.message });
  }
};

// Import images from JSON
exports.importImages = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No JSON file uploaded' });
    }
    
    const jsonData = JSON.parse(fs.readFileSync(req.file.path, 'utf8'));
    if (!jsonData.property_images || !Array.isArray(jsonData.property_images)) {
      return res.status(400).json({ success: false, message: 'Invalid JSON format' });
    }
    
    const data = readImagesData();
    jsonData.property_images.forEach(newImage => {
      const existingImage = data.property_images.find(
        img => img.id === newImage.id && img.propertyId === newImage.propertyId
      );
      if (!existingImage) {
        data.property_images.push({
          ...newImage,
          timestamp: newImage.timestamp || new Date().toISOString()
        });
      }
    });
    
    if (writeImagesData(data)) {
      fs.unlinkSync(req.file.path);
      res.status(201).json({ success: true, message: 'Images imported successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to import images' });
    }
  } catch (error) {
    console.error('Error in importImages:', error);
    res.status(500).json({ success: false, message: 'Failed to import images', error: error.message });
  }
};

// Export images to JSON
exports.exportImages = (req, res) => {
  try {
    const data = readImagesData();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in exportImages:', error);
    res.status(500).json({ success: false, message: 'Failed to export images', error: error.message });
  }
};

// Reorder images for a property
exports.reorderPropertyImages = (req, res) => {
  try {
    const { propertyId } = req.params;
    const { imageOrder } = req.body;
    
    if (!imageOrder || !Array.isArray(imageOrder)) {
      return res.status(400).json({ success: false, message: 'Invalid image order' });
    }
    
    const data = readImagesData();
    const propertyImages = data.property_images.filter(img => img.propertyId === propertyId);
    
    if (propertyImages.length !== imageOrder.length) {
      return res.status(400).json({ success: false, message: 'Image order list does not match number of images' });
    }
    
    imageOrder.forEach((imageId, index) => {
      const image = data.property_images.find(img => img.id === imageId && img.propertyId === propertyId);
      if (image) {
        image.order = index + 1;
      }
    });
    
    if (writeImagesData(data)) {
      res.status(200).json({ success: true, message: 'Images reordered successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to reorder images' });
    }
  } catch (error) {
    console.error('Error in reorderPropertyImages:', error);
    res.status(500).json({ success: false, message: 'Failed to reorder images', error: error.message });
  }
};

module.exports = exports;