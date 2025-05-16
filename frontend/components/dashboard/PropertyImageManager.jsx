// components/dashboard/PropertyImageManager.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaEdit, FaCheck, FaTimes, FaUpload, FaTrash } from 'react-icons/fa';

const PropertyImageManager = ({ propertyId, onSave, onClose }) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageDataFile, setImageDataFile] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState(null);

  // Fetch property data and images
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch property details (simulated)
        const fetchedProperty = await fetchPropertyDetails(propertyId);
        setPropertyDetails(fetchedProperty);
        
        // Fetch image data (simulated)
        const fetchedImages = await fetchPropertyImages(propertyId);
        setImages(fetchedImages);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load property data and images');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [propertyId]);

  // Simulated API calls
  const fetchPropertyDetails = async (id) => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          "OFFER NO": id,
          "Property Location": `Property ${id}`,
          "Status": "FOR SALE",
          "District": "Business Bay",
          "TOTAL PRICE": 15000000
        });
      }, 500);
    });
  };
  
  const fetchPropertyImages = async (id) => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate 0-5 random images
        const count = Math.floor(Math.random() * 6);
        const images = Array.from({ length: count }, (_, index) => ({
          id: `img-${id}-${index}`,
          url: `https://source.unsplash.com/random/800x600?dubai,property,${index+1}`,
          description: ['Exterior', 'Interior', 'Floor Plan', 'View', 'Master Bedroom'][index % 5],
          propertyId: id,
          timestamp: new Date(Date.now() - (index * 86400000)).toISOString()
        }));
        
        resolve(images);
      }, 700);
    });
  };

  // Handle file upload
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const file = files[0]; // We only need one file - the JSON data file
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        
        // Validate the data structure
        if (!Array.isArray(jsonData)) {
          throw new Error('Invalid JSON format. Expected an array of image objects.');
        }
        
        // Process the images data
        const processedImages = jsonData.map(img => {
          // Ensure each image has required fields
          if (!img.url || !img.propertyId) {
            throw new Error('Invalid image data. Each image must have url and propertyId fields.');
          }
          
          return {
            ...img,
            id: img.id || `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            description: img.description || '',
            timestamp: img.timestamp || new Date().toISOString()
          };
        });
        
        // Filter only images for this property
        const relevantImages = processedImages.filter(img => img.propertyId === propertyId);
        
        if (relevantImages.length === 0) {
          setError('No images found for this property in the uploaded file');
          return;
        }
        
        // Set the images
        setImages(relevantImages);
        setImageDataFile(file);
        setHasChanges(true);
        
      } catch (error) {
        console.error('Error parsing JSON:', error);
        setError(`Error parsing JSON: ${error.message}`);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read the file');
    };
    
    reader.readAsText(file);
  };

  // Handle adding a new image
  const handleAddImage = () => {
    const newImage = {
      id: `new-${Date.now()}`,
      url: '',
      description: '',
      propertyId: propertyId,
      timestamp: new Date().toISOString(),
      isNew: true
    };
    
    setImages([...images, newImage]);
    setHasChanges(true);
  };

  // Handle deleting an image
  const handleDeleteImage = (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setImages(images.filter(img => img.id !== imageId));
      setHasChanges(true);
    }
  };

  // Handle updating image properties
  const handleUpdateImage = (imageId, field, value) => {
    const updatedImages = images.map(img => 
      img.id === imageId ? { ...img, [field]: value } : img
    );
    
    setImages(updatedImages);
    setHasChanges(true);
  };

  // Handle saving all changes
  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, this would make API calls to update the images
      // For this demo, we'll simulate a successful save
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Call the parent component's save handler with the updated images
      if (onSave) {
        onSave(images);
      }
      
      // Close the modal
      onClose();
      
    } catch (error) {
      console.error('Error saving images:', error);
      setError('Failed to save images');
      setIsLoading(false);
    }
  };

  // Generate JSON for download
  const generateImagesJson = () => {
    return JSON.stringify(images, null, 2);
  };

  // Handle downloading the JSON file
  const handleDownloadJson = () => {
    const jsonStr = generateImagesJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `property-${propertyId}-images.json`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  // Show loading state
  if (isLoading && !propertyDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8">
          <div className="flex justify-center">
            <motion.div 
              className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="text-center mt-4 text-gray-600">Loading images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 rounded-t-lg flex justify-between items-center border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Property Images 
              {propertyDetails && ` - ${propertyDetails["Property Location"]}`}
            </h2>
            {propertyDetails && (
              <p className="text-sm text-gray-500">
                {propertyDetails["District"]} - {propertyDetails["Status"]} - 
                AED {propertyDetails["TOTAL PRICE"]?.toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Error display */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="bg-red-100 text-red-700 px-6 py-3 flex justify-between items-center"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900"
              >
                <FaTimes />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Action buttons row */}
        <div className="px-6 py-3 border-b bg-gray-50">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAddImage}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700"
            >
              <FaImage className="mr-2" />
              Add Image URL
            </button>
            
            <label className="px-3 py-2 bg-green-600 text-white rounded-lg flex items-center cursor-pointer hover:bg-green-700">
              <FaUpload className="mr-2" />
              Upload JSON
              <input
                type="file"
                accept="application/json"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            
            <button
              onClick={handleDownloadJson}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg flex items-center hover:bg-purple-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download JSON
            </button>
          </div>
        </div>
        
        {/* Image management section */}
        <div className="flex-1 overflow-y-auto p-6">
          {images.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FaImage className="mx-auto text-gray-300 text-6xl mb-4" />
              <p className="text-gray-500 text-lg">No images for this property</p>
              <p className="text-gray-400 mt-2">
                Add images using the buttons above or upload a JSON file
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {images.map((image, index) => (
                <motion.div 
                  key={image.id}
                  className={`border rounded-lg overflow-hidden shadow-sm ${
                    image.isNew ? 'border-blue-300 bg-blue-50' : ''
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Preview / Thumbnail */}
                    <div className="relative aspect-video">
                      {image.url ? (
                        <img 
                          src={image.url} 
                          alt={image.description || 'Property image'}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                          <FaImage className="text-gray-400 text-3xl" />
                        </div>
                      )}
                    </div>
                    
                    {/* Edit fields */}
                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL
                        </label>
                        <input
                          type="text"
                          value={image.url}
                          onChange={(e) => handleUpdateImage(image.id, 'url', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={image.description}
                          onChange={(e) => handleUpdateImage(image.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Image description"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          <span>ID: {image.id.substring(0, 8)}...</span>
                          <span className="mx-2">•</span>
                          <span>Added: {new Date(image.timestamp).toLocaleDateString()}</span>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded flex items-center hover:bg-red-200"
                        >
                          <FaTrash className="mr-1" size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-100 px-6 py-4 rounded-b-lg border-t flex justify-between">
          <div className="text-sm text-gray-500">
            {images.length} {images.length === 1 ? 'image' : 'images'} total
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            
            {hasChanges && (
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <motion.div 
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PropertyImageManager;