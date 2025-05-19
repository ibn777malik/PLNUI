// frontend/utils/propertyHelpers.js

/**
 * Creates placeholder images for a property
 * @param {Object} propertyData - The property data object
 * @param {number} count - Number of placeholder images to create
 * @returns {Array} Array of placeholder image objects
 */
export function createPlaceholders(propertyData, count) {
  return Array(count).fill(null).map((_, i) => ({
    id: `placeholder-${i}`,
    url: `https://source.unsplash.com/random/800x600?dubai,property,${i+1}`,
    description: `${propertyData?.["Property Location"] || "Property"} View ${i+1}`
  }));
}

/**
 * Formats the property price
 * @param {Object} property - The property data object
 * @returns {string} Formatted price string
 */
export function formatPrice(property) {
  return property["TOTAL PRICE"] 
    ? `AED ${property["TOTAL PRICE"].toLocaleString()}`
    : 'Price on Request';
}

/**
 * Formats the plot area
 * @param {Object} property - The property data object
 * @returns {string} Formatted plot area string
 */
export function formatPlotArea(property) {
  return property["Plot Area Sq. Ft."] 
    ? `${property["Plot Area Sq. Ft."].toLocaleString()} sqft (${property["Plot Area Sq M."]?.toLocaleString() || "-"} sqm)`
    : 'N/A';
}

/**
 * Formats the GFA (Gross Floor Area)
 * @param {Object} property - The property data object
 * @returns {string} Formatted GFA string
 */
export function formatGFA(property) {
  return property["GFA Sq. Ft."] 
    ? `${property["GFA Sq. Ft."].toLocaleString()} sqft (${property["GFA Sq M."]?.toLocaleString() || "-"} sqm)`
    : 'N/A';
}

/**
 * Normalizes image URL paths
 * @param {string} url - The image URL
 * @returns {string} Normalized URL
 */
export function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  
  // Fix URL path by ensuring lowercase /uploads/
  const fixedUrl = url.replace(/^\/Uploads\//i, '/uploads/');
  
  // Make sure the URL is absolute
  return fixedUrl.startsWith('http') 
    ? fixedUrl 
    : `http://localhost:5000${fixedUrl}`;
}

/**
 * Process property images data
 * @param {Array} images - The images array from API
 * @returns {Array} Processed images array
 */
export function processImages(images) {
  if (!Array.isArray(images)) return [];
  
  return images.map(img => {
    if (!img || !img.url) return null;
    
    return {
      id: img.id || `img-${Math.random().toString(36).substr(2, 9)}`,
      url: normalizeImageUrl(img.url),
      description: img.description || ''
    };
  }).filter(Boolean); // Remove null entries
}

export default {
  createPlaceholders,
  formatPrice,
  formatPlotArea,
  formatGFA,
  normalizeImageUrl,
  processImages
};