// components/dashboard/PropertyEditor.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave, FaTrash, FaUpload, FaImage } from 'react-icons/fa';

const PropertyEditor = ({ property, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({});
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [selectedTab, setSelectedTab] = useState('details');
  const [newImage, setNewImage] = useState({ url: '', description: '' });

  // Initialize the form data with the property data
  useEffect(() => {
    if (property) {
      setFormData({ ...property });
      
      // Fetch property images if available
      fetchPropertyImages(property["OFFER NO"]);
    }
  }, [property]);

  // Fetch property images
  const fetchPropertyImages = async (offerId) => {
    try {
      setIsLoading(true);
      // In a real implementation, this would be an API call
      // Here we'll simulate a response for demonstration
      
      // Mock API call
      setTimeout(() => {
        // Sample mock data - in production this would come from your API
        const mockImages = [
          { id: 1, url: `https://source.unsplash.com/random/800x600?dubai,property,1`, description: 'Front View', propertyId: offerId },
          { id: 2, url: `https://source.unsplash.com/random/800x600?dubai,property,2`, description: 'Interior', propertyId: offerId },
          { id: 3, url: `https://source.unsplash.com/random/800x600?dubai,property,3`, description: 'Aerial View', propertyId: offerId },
        ];
        
        setImages(mockImages);
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching property images:', error);
      setMessage({ text: 'Failed to load images', type: 'error' });
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Convert numeric values to numbers
    if (["TOTAL PRICE", "PRICE PER SQ FT PLOT", "PRICE PER SQ FT GFA", "Plot Area Sq. Ft.", "GFA Sq. Ft."].includes(name)) {
      processedValue = value === '' ? '' : Number(value);
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  // Handle save
  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this would be an API call to update the property
      // Here we'll simulate success for demonstration purposes
      
      // Mock API call
      setTimeout(() => {
        setIsLoading(false);
        setMessage({ text: 'Property saved successfully', type: 'success' });
        
        // Call the onSave callback with the updated data
        if (onSave) onSave(formData, images);
      }, 1000);
      
    } catch (error) {
      console.error('Error saving property:', error);
      setMessage({ text: 'Failed to save property', type: 'error' });
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would be an API call to delete the property
        // Here we'll simulate success for demonstration purposes
        
        // Mock API call
        setTimeout(() => {
          setIsLoading(false);
          setMessage({ text: 'Property deleted successfully', type: 'success' });
          
          // Call the onDelete callback
          if (onDelete) onDelete(formData["OFFER NO"]);
          
          // Close the editor
          if (onClose) onClose();
        }, 1000);
        
      } catch (error) {
        console.error('Error deleting property:', error);
        setMessage({ text: 'Failed to delete property', type: 'error' });
        setIsLoading(false);
      }
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Create a preview URL for the image
    const reader = new FileReader();
    reader.onloadend = () => {
      // Add the new image to the list
      const newImageWithId = {
        id: Date.now(), // Generate a temporary ID
        url: reader.result,
        description: newImage.description || 'New Image',
        propertyId: formData["OFFER NO"],
        isNew: true // Flag to indicate this is a new image
      };
      
      setImages([...images, newImageWithId]);
      setNewImage({ url: '', description: '' }); // Reset the new image form
      
      // Show success message
      setMessage({ text: 'Image uploaded successfully', type: 'success' });
    };
    
    reader.readAsDataURL(file);
  };

  // Handle deletion of an image
  const handleImageDelete = (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setImages(images.filter(img => img.id !== imageId));
      setMessage({ text: 'Image deleted successfully', type: 'success' });
    }
  };

  // Handle update to image description
  const handleImageDescriptionChange = (imageId, description) => {
    setImages(images.map(img => 
      img.id === imageId ? { ...img, description } : img
    ));
  };

  // Get property fields for editing
  const getEditableFields = () => {
    if (!formData) return [];
    
    // Define groups of fields for better organization
    const fieldGroups = [
      {
        title: 'Basic Information',
        fields: ['OFFER NO', 'Property Location', 'District', 'City__1', 'Type', 'Status']
      },
      {
        title: 'Financial Details',
        fields: ['TOTAL PRICE', 'PRICE PER SQ FT PLOT', 'PRICE PER SQ FT GFA']
      },
      {
        title: 'Property Specifications',
        fields: ['Plot Area Sq. Ft.', 'GFA Sq. Ft.', 'Usage', 'Proposed Height Letters', 'FAR', 'Freehold']
      },
      {
        title: 'Location Information',
        fields: ['Location Pin', 'Coordinates']
      }
    ];
    
    return fieldGroups;
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 rounded-t-lg flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {formData["Property Location"] || `Property ${formData["OFFER NO"]}`}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 disabled:opacity-50"
            >
              <FaSave className="mr-2" />
              Save
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-gray-100 px-6 py-2 border-b">
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedTab('details')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedTab === 'details' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Property Details
            </button>
            <button
              onClick={() => setSelectedTab('images')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedTab === 'images' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Images
            </button>
          </div>
        </div>
        
        {/* Message display */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              className={`px-6 py-3 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Property Details Tab */}
          {selectedTab === 'details' && (
            <div className="space-y-6">
              {getEditableFields().map((group) => (
                <div key={group.title} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">{group.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.fields.map((field) => (
                      <div key={field} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          {field}
                        </label>
                        {field === 'Status' ? (
                          <select
                            name={field}
                            value={formData[field] || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Status</option>
                            <option value="FOR SALE">FOR SALE</option>
                            <option value="SOLD">SOLD</option>
                            <option value="Request">Request</option>
                          </select>
                        ) : field === 'Freehold' ? (
                          <select
                            name={field}
                            value={formData[field] || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        ) : field === 'Type' ? (
                          <select
                            name={field}
                            value={formData[field] || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Type</option>
                            <option value="Plot">Plot</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Residential">Residential</option>
                            <option value="Mixed Use">Mixed Use</option>
                          </select>
                        ) : (
                          <input
                            type={["TOTAL PRICE", "PRICE PER SQ FT PLOT", "PRICE PER SQ FT GFA", "Plot Area Sq. Ft.", "GFA Sq. Ft.", "FAR"].includes(field) ? "number" : "text"}
                            name={field}
                            value={formData[field] !== undefined ? formData[field] : ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            disabled={field === 'OFFER NO'} // Don't allow editing of OFFER NO
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Delete button */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-700"
                >
                  <FaTrash className="mr-2" />
                  Delete Property
                </button>
              </div>
            </div>
          )}
          
          {/* Images Tab */}
          {selectedTab === 'images' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Property Images</h3>
              
              {/* Image upload section */}
              <div className="mb-6 border rounded-lg p-4 bg-gray-50">
                <h4 className="text-md font-medium mb-3">Upload New Image</h4>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newImage.description}
                      onChange={(e) => setNewImage({...newImage, description: e.target.value})}
                      placeholder="Image description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image File
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer hover:bg-blue-700">
                        <FaUpload className="mr-2" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Images display */}
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  {images.length === 0 ? (
                    <div className="text-center py-8 bg-gray-100 rounded-lg">
                      <FaImage className="mx-auto text-gray-400 text-5xl mb-4" />
                      <p className="text-gray-500">No images for this property yet</p>
                      <p className="text-gray-500 text-sm mt-2">Upload images using the form above</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {images.map((image) => (
                        <div key={image.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <div className="relative h-40">
                            <img
                              src={image.url}
                              alt={image.description}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => handleImageDelete(image.id)}
                              className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700"
                              title="Delete image"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                          <div className="p-3">
                            <input
                              type="text"
                              value={image.description}
                              onChange={(e) => handleImageDescriptionChange(image.id, e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm"
                              placeholder="Image description"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PropertyEditor;