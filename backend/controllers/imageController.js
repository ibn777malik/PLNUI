// backend/controllers/imageController.js
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
    res.json(data.property_images);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get images', error: error.message });
  }
};

// Get images for a specific property
exports.getPropertyImages = (req, res) => {
  try {
    const { propertyId } = req.params;
    const data = readImagesData();
    const propertyImages = data.property_images.filter(img => img.propertyId === propertyId);
    res.json(propertyImages);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get property images', error: error.message });
  }
};

// Add a new image to a property
exports.addPropertyImage = (req, res) => {
  try {
    const { propertyId } = req.params;
    
    // Check if image file was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
    
    // Ensure property directory exists
    const { originalDir, thumbnailsDir } = ensurePropertyDir(propertyId);
    
    // Get the uploaded file details
    const file = req.file;
    const fileExtension = path.extname(file.originalname);
    const imageId = `img-${uuidv4()}`;
    const filename = `${imageId}${fileExtension}`;
    
    // Move the file to the property's directory
    const filePath = path.join(originalDir, filename);
    fs.renameSync(file.path, filePath);
    
    // Create a thumbnail (in a real app, you would use a library like sharp)
    // For this example, we'll just copy the file
    const thumbnailPath = path.join(thumbnailsDir, `thumb-${filename}`);
    fs.copyFileSync(filePath, thumbnailPath);
    
    // Read the current images data
    const data = readImagesData();
    
    // Create the new image object
    const newImage = {
      id: imageId,
      propertyId,
      url: `/uploads/properties/${propertyId}/original/${filename}`,
      thumbnailUrl: `/uploads/properties/${propertyId}/thumbnails/thumb-${filename}`,
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
    
    // Add the new image to the data
    data.property_images.push(newImage);
    
    // Write the updated data
    if (writeImagesData(data)) {
      res.status(201).json({ success: true, image: newImage });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save image data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add image', error: error.message });
  }
};

// Add image via URL
exports.addPropertyImageUrl = (req, res) => {
  try {
    const { propertyId } = req.params;
    const { url, description, type } = req.body;
    
    if (!url) {
      return res.status(400).json({ success: false, message: 'Image URL is required' });
    }
    
    // Read the current images data
    const data = readImagesData();
    
    // Create the new image object
    const newImage = {
      id: `img-${uuidv4()}`,
      propertyId,
      url,
      description: description || '',
      timestamp: new Date().toISOString(),
      order: data.property_images.filter(img => img.propertyId === propertyId).length + 1,
      type: type || 'exterior'
    };
    
    // Add the new image to the data
    data.property_images.push(newImage);
    
    // Write the updated data
    if (writeImagesData(data)) {
      res.status(201).json({ success: true, image: newImage });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save image data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add image URL', error: error.message });
  }
};

// Update an image
exports.updatePropertyImage = (req, res) => {
  try {
    const { propertyId, imageId } = req.params;
    const { description, order, type } = req.body;
    
    // Read the current images data
    const data = readImagesData();
    
    // Find the image to update
    const imageIndex = data.property_images.findIndex(img => img.id === imageId && img.propertyId === propertyId);
    
    if (imageIndex === -1) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    
    // Update the image properties
    if (description !== undefined) data.property_images[imageIndex].description = description;
    if (order !== undefined) data.property_images[imageIndex].order = order;
    if (type !== undefined) data.property_images[imageIndex].type = type;
    
    // Update the timestamp
    data.property_images[imageIndex].timestamp = new Date().toISOString();
    
    // Write the updated data
    if (writeImagesData(data)) {
      res.json({ success: true, image: data.property_images[imageIndex] });
    } else {
      res.status(500).json({ success: false, message: 'Failed to update image data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update image', error: error.message });
  }
};

// Delete an image
exports.deletePropertyImage = (req, res) => {
  try {
    const { propertyId, imageId } = req.params;
    
    // Read the current images data
    const data = readImagesData();
    
    // Find the image to delete
    const imageIndex = data.property_images.findIndex(img => img.id === imageId && img.propertyId === propertyId);
    
    if (imageIndex === -1) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    
    const imageToDelete = data.property_images[imageIndex];
    
    // If the image is stored on the server, delete the file
    if (imageToDelete.url && imageToDelete.url.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', imageToDelete.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      // Also delete the thumbnail if it exists
      if (imageToDelete.thumbnailUrl) {
        const thumbnailPath = path.join(__dirname, '..', imageToDelete.thumbnailUrl);
        if (fs.existsSync(thumbnailPath)) {
          fs.unlinkSync(thumbnailPath);
        }
      }
    }
    
    // Remove the image from the data
    data.property_images.splice(imageIndex, 1);
    
    // Write the updated data
    if (writeImagesData(data)) {
      res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to update image data after deletion' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete image', error: error.message });
  }
};

// Bulk upload images
exports.bulkUploadImages = (req, res) => {
  try {
    const { propertyId } = req.params;
    
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files uploaded' });
    }
    
    // Ensure property directory exists
    const { originalDir, thumbnailsDir } = ensurePropertyDir(propertyId);
    
    // Read the current images data
    const data = readImagesData();
    
    // Get the current highest order for this property
    const currentMaxOrder = Math.max(
      0,
      ...data.property_images
        .filter(img => img.propertyId === propertyId)
        .map(img => img.order || 0)
    );
    
    // Process each uploaded file
    const uploadedImages = req.files.map((file, index) => {
      const fileExtension = path.extname(file.originalname);
      const imageId = `img-${uuidv4()}`;
      const filename = `${imageId}${fileExtension}`;
      
      // Move the file to the property's directory
      const filePath = path.join(originalDir, filename);
      fs.renameSync(file.path, filePath);
      
      // Create a thumbnail
      const thumbnailPath = path.join(thumbnailsDir, `thumb-${filename}`);
      fs.copyFileSync(filePath, thumbnailPath);
      
      // Create the new image object
      const newImage = {
        id: imageId,
        propertyId,
        url: `/uploads/properties/${propertyId}/original/${filename}`,
        thumbnailUrl: `/uploads/properties/${propertyId}/thumbnails/thumb-${filename}`,
        description: req.body.descriptions ? req.body.descriptions[index] || '' : '',
        timestamp: new Date().toISOString(),
        order: currentMaxOrder + index + 1,
        type: req.body.types ? req.body.types[index] || 'exterior' : 'exterior',
        metadata: {
          filename: filename,
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype
        }
      };
      
      // Add the new image to the data
      data.property_images.push(newImage);
      
      return newImage;
    });
    
    // Write the updated data
    if (writeImagesData(data)) {
      res.status(201).json({ success: true, images: uploadedImages });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save image data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to bulk upload images', error: error.message });
  }
};

// Import images from JSON
exports.importImages = (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No JSON file uploaded' });
    }
    
    // Read the uploaded JSON file
    const jsonData = JSON.parse(fs.readFileSync(req.file.path, 'utf8'));
    
    // Validate the JSON structure
    if (!jsonData.property_images || !Array.isArray(jsonData.property_images)) {
      return res.status(400).json({ success: false, message: 'Invalid JSON structure' });
    }
    
    // Read the current images data
    const currentData = readImagesData();
    
    // Merge the imported images with the current images
    // For this example, we'll just append the new images
    // In a real app, you might want to check for duplicates
    const mergedImages = [...currentData.property_images, ...jsonData.property_images];
    
    // Write the merged data
    const newData = { property_images: mergedImages };
    if (writeImagesData(newData)) {
      res.json({ success: true, message: 'Images imported successfully', count: jsonData.property_images.length });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save imported image data' });
    }
    
    // Delete the temporary uploaded file
    fs.unlinkSync(req.file.path);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to import images', error: error.message });
  }
};

// Export images to JSON
exports.exportImages = (req, res) => {
  try {
    // Read the current images data
    const data = readImagesData();
    
    // Filter by property ID if specified
    if (req.query.propertyId) {
      data.property_images = data.property_images.filter(img => img.propertyId === req.query.propertyId);
    }
    
    // Set the response headers for file download
    res.setHeader('Content-Disposition', 'attachment; filename=property_images.json');
    res.setHeader('Content-Type', 'application/json');
    
    // Send the data
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to export images', error: error.message });
  }
};

// Reorder images for a property
exports.reorderPropertyImages = (req, res) => {
  try {
    const { propertyId } = req.params;
    const { orderMap } = req.body;
    
    if (!orderMap || typeof orderMap !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid order map' });
    }
    
    // Read the current images data
    const data = readImagesData();
    
    // Update the order of each image
    let updated = false;
    data.property_images.forEach(img => {
      if (img.propertyId === propertyId && orderMap[img.id] !== undefined) {
        img.order = orderMap[img.id];
        updated = true;
      }
    });
    
    if (!updated) {
      return res.status(404).json({ success: false, message: 'No images found for the given property ID' });
    }
    
    // Write the updated data
    if (writeImagesData(data)) {
      res.json({ success: true, message: 'Images reordered successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save reordered image data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reorder images', error: error.message });
  }
};