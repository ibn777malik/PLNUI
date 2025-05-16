// frontend/utils/apiUtils.js

// Base API URL
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Upload an image file to the server for a specific property
 * 
 * @param {string} propertyId - The ID of the property
 * @param {File} file - The image file to upload
 * @param {string} description - Description of the image
 * @returns {Promise} - Promise that resolves with the uploaded image data
 */
export const uploadPropertyImage = async (propertyId, file, description) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('description', description || '');
    
    const response = await fetch(`${API_BASE_URL}/images/property/${propertyId}/upload`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - it will be set automatically with the correct boundary
    });
    
    if (!response.ok) {
      throw new Error(`Error uploading image: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Add an image URL to a property
 * 
 * @param {string} propertyId - The ID of the property
 * @param {string} url - The URL of the image
 * @param {string} description - Description of the image
 * @returns {Promise} - Promise that resolves with the added image data
 */
export const addPropertyImageUrl = async (propertyId, url, description) => {
  try {
    const response = await fetch(`${API_BASE_URL}/images/property/${propertyId}/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        description: description || '',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error adding image URL: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding image URL:', error);
    throw error;
  }
};

/**
 * Update an image's properties
 * 
 * @param {string} propertyId - The ID of the property
 * @param {string} imageId - The ID of the image
 * @param {object} updateData - Data to update (description, order, etc.)
 * @returns {Promise} - Promise that resolves with the updated image data
 */
export const updatePropertyImage = async (propertyId, imageId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/images/property/${propertyId}/image/${imageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      throw new Error(`Error updating image: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating image:', error);
    throw error;
  }
};

/**
 * Delete an image
 * 
 * @param {string} propertyId - The ID of the property
 * @param {string} imageId - The ID of the image
 * @returns {Promise} - Promise that resolves with the deletion result
 */
export const deletePropertyImage = async (propertyId, imageId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/images/property/${propertyId}/image/${imageId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting image: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * Get all images for a property
 * 
 * @param {string} propertyId - The ID of the property
 * @returns {Promise} - Promise that resolves with the property images
 */
export const getPropertyImages = async (propertyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/images/property/${propertyId}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching property images: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching property images:', error);
    throw error;
  }
};

/**
 * Bulk upload images for a property
 * 
 * @param {string} propertyId - The ID of the property
 * @param {File[]} files - Array of image files to upload
 * @param {string[]} descriptions - Array of descriptions matching the files
 * @returns {Promise} - Promise that resolves with the uploaded images data
 */
export const bulkUploadPropertyImages = async (propertyId, files, descriptions = []) => {
  try {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append('images', file);
    });
    
    // Add descriptions if provided
    if (descriptions.length > 0) {
      descriptions.forEach((desc, index) => {
        formData.append('descriptions[]', desc || '');
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/images/property/${propertyId}/bulk`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Error bulk uploading images: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error bulk uploading images:', error);
    throw error;
  }
};

// Export all utility functions
export default {
  uploadPropertyImage,
  addPropertyImageUrl,
  updatePropertyImage,
  deletePropertyImage,
  getPropertyImages,
  bulkUploadPropertyImages
};