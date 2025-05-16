import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave, FaTrash, FaUpload, FaImage, FaSpinner } from 'react-icons/fa';
import { 
  getPropertyImages, 
  uploadPropertyImage, 
  addPropertyImageUrl, 
  updatePropertyImage, 
  deletePropertyImage, 
  bulkUploadPropertyImages 
} from '../../utils/apiUtils';

const PropertyEditor = ({ property, onClose, onSave, onDelete, isNewProperty = false }) => {
  // State Management
  const [formData, setFormData] = useState({});
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [selectedTab, setSelectedTab] = useState('details');
  const [newImage, setNewImage] = useState({ url: '', description: '' });
  const [bulkImages, setBulkImages] = useState([]);
  const fileInputRef = useRef(null);
  const bulkFileInputRef = useRef(null);

  // Handle image load error
  const handleImageError = (imageId) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, error: true } : img
    ));
  };

  // Initialize form data
  useEffect(() => {
    if (property) {
      setFormData({ ...property });
      if (!isNewProperty && property["OFFER NO"]) {
        fetchPropertyImages(property["OFFER NO"]);
      }
    }
  }, [property, isNewProperty]);

  // Fetch property images
  const fetchPropertyImages = useCallback(async (offerId) => {
    try {
      setImageLoading(true);
      const response = await getPropertyImages(offerId);
      setImages(response?.images || []);
    } catch (error) {
      console.error('Error fetching property images:', error);
      setMessage({ 
        text: `Failed to load images: ${error.message || 'Unknown error'}`, 
        type: 'error' 
      });
    } finally {
      setImageLoading(false);
    }
  }, []);

  // Handle form input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    const numericFields = ["TOTAL PRICE", "PRICE PER SQ FT PLOT", "PRICE PER SQ FT GFA", "Plot Area Sq. Ft.", "GFA Sq. Ft.", "FAR"];
    const processedValue = numericFields.includes(name) ? (value === '' ? '' : Number(value)) : value;

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  }, []);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!formData["Property Location"]) {
      setMessage({ text: 'Property Location is required', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      // Handle new image URL
      if (newImage.url && !isNewProperty) {
        await addPropertyImageUrl(formData["OFFER NO"], newImage.url, newImage.description);
        setNewImage({ url: '', description: '' });
      }

      // Update image descriptions
      const imagePromises = images
        .filter(img => img.hasChanges)
        .map(img => updatePropertyImage(formData["OFFER NO"], img.id, { description: img.description }));
      
      if (imagePromises.length > 0) {
        await Promise.all(imagePromises);
      }

      // Handle bulk image uploads
      if (bulkImages.length > 0 && !isNewProperty) {
        const files = bulkImages.map(img => img.file);
        const descriptions = bulkImages.map(img => img.description);
        await bulkUploadPropertyImages(formData["OFFER NO"], files, descriptions);
        setBulkImages([]);
      }

      setMessage({ text: 'Property saved successfully', type: 'success' });
      onSave?.(formData, images);
    } catch (error) {
      console.error('Error saving property:', error);
      setMessage({ 
        text: `Failed to save property: ${error.message || 'Unknown error'}`, 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, images, newImage, bulkImages, isNewProperty, onSave]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) return;

    setIsLoading(true);
    try {
      onDelete?.(formData["OFFER NO"]);
      onClose?.();
    } catch (error) {
      console.error('Error deleting property:', error);
      setMessage({ 
        text: `Failed to delete property: ${error.message || 'Unknown error'}`, 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, onDelete, onClose]);

  // Handle adding image via URL
  const handleAddImageUrl = useCallback(async () => {
    if (!newImage.url) {
      setMessage({ text: 'Please enter an image URL', type: 'error' });
      return;
    }

    if (isNewProperty) {
      setImages(prev => [
        ...prev,
        {
          id: `new-${Date.now()}`,
          url: newImage.url,
          description: newImage.description,
          isNew: true
        }
      ]);
      setNewImage({ url: '', description: '' });
      setMessage({ text: 'Image added. It will be uploaded when you save the property.', type: 'success' });
    } else {
      setImageLoading(true);
      try {
        const response = await addPropertyImageUrl(formData["OFFER NO"], newImage.url, newImage.description);
        setImages(prev => [...prev, response.image]);
        setNewImage({ url: '', description: '' });
        setMessage({ text: 'Image added successfully', type: 'success' });
      } catch (error) {
        console.error('Error adding image URL:', error);
        setMessage({ 
          text: `Failed to add image: ${error.message || 'Unknown error'}`, 
          type: 'error' 
        });
      } finally {
        setImageLoading(false);
      }
    }
  }, [newImage, isNewProperty, formData]);

  // Handle file upload
  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      const preview = reader.result;
      if (isNewProperty) {
        setImages(prev => [
          ...prev,
          {
            id: `temp-${Date.now()}`,
            file,
            preview,
            description: newImage.description,
            isNew: true
          }
        ]);
        setMessage({ text: 'Image added. It will be uploaded when you save the property.', type: 'success' });
      } else {
        setImageLoading(true);
        try {
          const response = await uploadPropertyImage(formData["OFFER NO"], file, newImage.description);
          setImages(prev => [...prev, response.image]);
          setMessage({ text: 'Image uploaded successfully', type: 'success' });
        } catch (error) {
          console.error('Error uploading image:', error);
          setMessage({ 
            text: `Failed to upload image: ${error.message || 'Unknown error'}`, 
            type: 'error' 
          });
        } finally {
          setImageLoading(false);
        }
      }
      setNewImage(prev => ({ ...prev, description: '' }));
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  }, [newImage, isNewProperty, formData]);

  // Handle bulk file upload
  const handleBulkFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newBulkImages = files.map(file => ({
      id: `bulk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      filename: file.name,
      size: file.size,
      description: '',
      preview: URL.createObjectURL(file)
    }));

    setBulkImages(prev => [...prev, ...newBulkImages]);
    setMessage({ 
      text: `${files.length} files selected for upload. They will be processed when you save.`, 
      type: 'success' 
    });
    if (bulkFileInputRef.current) bulkFileInputRef.current.value = '';
  }, []);

  // Handle image deletion
  const handleImageDelete = useCallback(async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    const imageToDelete = images.find(img => img.id === imageId);
    if (!imageToDelete) return;

    if (imageToDelete.isNew || isNewProperty) {
      setImages(prev => prev.filter(img => img.id !== imageId));
      setMessage({ text: 'Image removed', type: 'success' });
    } else {
      setImageLoading(true);
      try {
        await deletePropertyImage(formData["OFFER NO"], imageId);
        setImages(prev => prev.filter(img => img.id !== imageId));
        setMessage({ text: 'Image deleted successfully', type: 'success' });
      } catch (error) {
        console.error('Error deleting image:', error);
        setMessage({ 
          text: `Failed to delete image: ${error.message || 'Unknown error'}`, 
          type: 'error' 
        });
      } finally {
        setImageLoading(false);
      }
    }
  }, [images, isNewProperty, formData]);

  // Handle removing bulk image
  const handleRemoveBulkImage = useCallback((imageId) => {
    setBulkImages(prev => {
      const image = prev.find(img => img.id === imageId);
      if (image?.preview?.startsWith('blob:')) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== imageId);
    });
  }, []);

  // Handle image description changes
  const handleImageDescriptionChange = useCallback((imageId, description) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, description, hasChanges: true } : img
    ));
  }, []);

  // Handle bulk image description changes
  const handleBulkImageDescriptionChange = useCallback((imageId, description) => {
    setBulkImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, description } : img
    ));
  }, []);

  // Define editable fields
  const getEditableFields = useCallback(() => {
    if (!formData) return [];
    return [
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
  }, [formData]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      bulkImages.forEach(img => {
        if (img.preview?.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [bulkImages]);

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
            {isNewProperty ? "New Property" : formData["Property Location"] || `Property ${formData["OFFER NO"]}`}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save
                </>
              )}
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
          {selectedTab === 'details' && (
            <div className="space-y-6">
              {getEditableFields().map(group => (
                <div key={group.title} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">{group.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.fields.map(field => (
                      <div key={field} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">{field}</label>
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
                            value={formData[field] ?? ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            disabled={field === 'OFFER NO' && !isNewProperty}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {!isNewProperty && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-700"
                  >
                    <FaTrash className="mr-2" />
                    Delete Property
                  </button>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'images' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Property Images</h3>

              {/* Image upload section */}
              <div className="mb-6 border rounded-lg p-4 bg-gray-50">
                <h4 className="text-md font-medium mb-3">Add Image</h4>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={newImage.description}
                      onChange={e => setNewImage(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Image description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newImage.url}
                        onChange={e => setNewImage(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={handleAddImageUrl}
                        disabled={imageLoading || !newImage.url}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex-shrink-0 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {imageLoading ? <FaSpinner className="animate-spin" /> : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Or Upload Image File</label>
                  <div className="flex items-center gap-2">
                    <label className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer hover:bg-green-700">
                      <FaUpload className="mr-2" />
                      Select File
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                    <span className="text-sm text-gray-500">Supported formats: JPG, PNG, GIF</span>
                  </div>
                </div>
              </div>

              {/* Bulk upload section */}
              <div className="mb-6 border rounded-lg p-4 bg-gray-50">
                <h4 className="text-md font-medium mb-3">Bulk Upload</h4>
                <div className="flex items-center gap-2">
                  <label className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer hover:bg-purple-700">
                    <FaUpload className="mr-2" />
                    Select Multiple Files
                    <input
                      type="file"
                      ref={bulkFileInputRef}
                      accept="image/*"
                      multiple
                      onChange={handleBulkFileSelect}
                      className="hidden"
                    />
                  </label>
                  <span className="text-sm text-gray-500">Select multiple images to upload in bulk</span>
                </div>
                {bulkImages.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium mb-2">Selected files ({bulkImages.length}):</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {bulkImages.map(img => (
                        <div key={img.id} className="border rounded p-2 flex flex-col">
                          <div className="relative h-32 mb-2">
                            <img
                              src={img.preview}
                              alt={img.filename}
                              className="w-full h-full object-cover rounded"
                              onError={() => handleImageError(img.id)}
                            />
                            <button
                              onClick={() => handleRemoveBulkImage(img.id)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={img.description}
                            onChange={e => handleBulkImageDescriptionChange(img.id, e.target.value)}
                            placeholder="Description"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                          <div className="text-xs text-gray-500 mt-1 truncate">
                            {img.filename} ({Math.round(img.size / 1024)} KB)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Images display */}
              <div className="mt-6">
                <h4 className="text-md font-medium mb-3">Property Images</h4>
                {imageLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <FaSpinner className="animate-spin text-blue-600 text-2xl" />
                    <span className="ml-2">Loading images...</span>
                  </div>
                ) : images.length === 0 ? (
                  <div className="text-center py-8 bg-gray-100 rounded-lg">
                    <FaImage className="mx-auto text-gray-400 text-5xl mb-4" />
                    <p className="text-gray-500">No images for this property yet</p>
                    <p className="text-gray-500 text-sm mt-2">
                      {isNewProperty ? "You can add images after saving the property" : "Upload images using the form above"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map(image => (
                      <div key={image.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative h-40">
                          {image.error ? (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
                              <FaImage className="text-gray-400 text-3xl" />
                              <span className="text-gray-500 text-sm ml-2">Image not found</span>
                            </div>
                          ) : (
                            <img
                              src={image.preview || image.url}
                              alt={image.description || 'Property image'}
                              className="w-full h-full object-cover"
                              onError={() => handleImageError(image.id)}
                            />
                          )}
                          <button
                            onClick={() => handleImageDelete(image.id)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700"
                            title="Delete image"
                          >
                            <FaTrash size={14} />
                          </button>
                          {image.isNew && (
                            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs py-1 px-2 rounded">
                              New
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <input
                            type="text"
                            value={image.description || ''}
                            onChange={e => handleImageDescriptionChange(image.id, e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Image description"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PropertyEditor;