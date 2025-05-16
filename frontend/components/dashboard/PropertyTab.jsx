// components/dashboard/PropertyTab.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import PropertyTable from './PropertyTable';
import PropertyFilters from './PropertyFilters';
import { FaPlus } from 'react-icons/fa';
import PropertyEditor from './PropertyEditor';

const PropertyTab = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState({
    'OFFER NO': true,
    'Name': true,
    'Property Location': true,
    'District': true, 
    'City__1': true,
    'TOTAL PRICE': true,
    'Status': true,
    'Type': true,
    'Freehold': true,
    'Plot Area Sq. Ft.': true,
    'GFA Sq. Ft.': true,
    'Usage': true,
    'Proposed Height Letters': true,
    'PRICE PER SQ FT PLOT': true,
    'PRICE PER SQ FT GFA': true
  });
  const [allColumns, setAllColumns] = useState([]);
  const [isCreatingProperty, setIsCreatingProperty] = useState(false);
  const [imagesData, setImagesData] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch properties data
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/properties');
        const data = await response.json();
        
        if (data) {
          setProperties(data);
          setFilteredProperties(data);
          
          // Extract all possible column names from the first item
          if (data.length > 0) {
            const columnNames = Object.keys(data[0]);
            setAllColumns(columnNames);
            
            // Initialize visible columns
            const initialVisibleColumns = {};
            columnNames.forEach(column => {
              // Set default visible status based on importance
              const isDefaultVisible = [
                'OFFER NO', 'Name', 'Property Location', 'District', 'City__1', 
                'TOTAL PRICE', 'Status', 'Type', 'Freehold', 
                'Plot Area Sq. Ft.', 'GFA Sq. Ft.', 'Usage', 'Proposed Height Letters',
                'PRICE PER SQ FT PLOT', 'PRICE PER SQ FT GFA'
              ].includes(column);
              
              initialVisibleColumns[column] = isDefaultVisible;
            });
            setVisibleColumns(initialVisibleColumns);
          }
        }

        // Also fetch the images data (in a real application)
        // For demo purposes, we'll create mock image data
        createMockImageData(data);

      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Create mock image data for demonstration
  const createMockImageData = (propertiesData) => {
    if (!propertiesData || propertiesData.length === 0) return;
    
    const mockImages = {};
    
    propertiesData.forEach(property => {
      const offerId = property["OFFER NO"];
      // Create 0-3 random images for each property
      const numImages = Math.floor(Math.random() * 4);
      const propertyImages = [];
      
      for (let i = 0; i < numImages; i++) {
        propertyImages.push({
          id: `${offerId}-img-${i}`,
          url: `https://source.unsplash.com/random/800x600?dubai,property,${offerId}-${i}`,
          description: ['Front View', 'Interior', 'Aerial View', 'Floor Plan'][i % 4],
          timestamp: new Date().toISOString()
        });
      }
      
      mockImages[offerId] = propertyImages;
    });
    
    setImagesData(mockImages);
  };

  // Apply filters function (will be passed to PropertyFilters component)
  const applyFilters = (filters) => {
    setFilteredProperties(filters.filteredData);
  };

  // Toggle column visibility
  const toggleColumnVisibility = (columnName) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));
  };

  // Handle property updates (create, update, delete)
  const handlePropertyUpdate = (action, data, additionalData = null) => {
    switch (action) {
      case 'create':
        // Generate a new unique OFFER NO
        const newOfferId = `PL-${Date.now()}`;
        const newProperty = {
          ...data,
          "OFFER NO": newOfferId
        };
        
        // Add the new property to the list
        setProperties(prev => [...prev, newProperty]);
        setFilteredProperties(prev => [...prev, newProperty]);
        
        // Initialize empty images array for the new property
        setImagesData(prev => ({
          ...prev,
          [newOfferId]: []
        }));
        
        setHasUnsavedChanges(true);
        break;
        
      case 'update':
        // Update the property in the list
        setProperties(prev => 
          prev.map(p => p["OFFER NO"] === data["OFFER NO"] ? data : p)
        );
        setFilteredProperties(prev => 
          prev.map(p => p["OFFER NO"] === data["OFFER NO"] ? data : p)
        );
        
        // If there are images to update
        if (additionalData) {
          setImagesData(prev => ({
            ...prev,
            [data["OFFER NO"]]: additionalData
          }));
        }
        
        setHasUnsavedChanges(true);
        break;
        
      case 'delete':
        // Remove the property from the list
        setProperties(prev => 
          prev.filter(p => p["OFFER NO"] !== data)
        );
        setFilteredProperties(prev => 
          prev.filter(p => p["OFFER NO"] !== data)
        );
        
        // Remove the images for this property
        setImagesData(prev => {
          const newData = { ...prev };
          delete newData[data];
          return newData;
        });
        
        setHasUnsavedChanges(true);
        break;
        
      case 'bulkImageUpload':
        // Update images for multiple properties
        const newImagesData = { ...imagesData };
        
        data.forEach(item => {
          const propertyId = item.propertyId;
          
          // Convert the uploaded images to the format we're using
          const formattedImages = item.images.map(img => ({
            id: `${propertyId}-img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url: img.preview, // In a real app, this would be the URL from your server
            description: img.description || 'New Image',
            timestamp: new Date().toISOString()
          }));
          
          // Add the new images to the existing ones
          newImagesData[propertyId] = [
            ...(newImagesData[propertyId] || []),
            ...formattedImages
          ];
        });
        
        setImagesData(newImagesData);
        setHasUnsavedChanges(true);
        break;
        
      default:
        console.warn(`Unknown action: ${action}`);
    }
  };

  // Create a new empty property
  const handleCreateNewProperty = () => {
    const emptyProperty = {
      "OFFER NO": "", // Will be generated on save
      "Property Location": "",
      "District": "",
      "City__1": "",
      "Status": "FOR SALE",
      "Type": "",
      "TOTAL PRICE": 0,
      "Plot Area Sq. Ft.": 0,
      "GFA Sq. Ft.": 0,
      "Usage": "",
      "Proposed Height Letters": "",
      "FAR": 0,
      "Freehold": "No",
      "PRICE PER SQ FT PLOT": 0,
      "PRICE PER SQ FT GFA": 0,
      "Location Pin": ""
    };
    
    setIsCreatingProperty(true);
  };

  // Save changes to server
  const saveChangesToServer = async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this would be API calls to update the database
      // For this demo, we'll simulate success
      
      // First save properties data
      console.log('Saving properties data:', properties);
      
      // Then save images data
      console.log('Saving images data:', imagesData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasUnsavedChanges(false);
      alert('All changes saved successfully!');
      
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div 
          className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600 my-4">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Properties Management</h2>
          <p className="text-gray-600">
            Manage and filter your property listings. Toggle columns, apply advanced filters, and more.
          </p>
        </div>
        
        <div className="flex space-x-3">
          {hasUnsavedChanges && (
            <motion.button
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
              onClick={saveChangesToServer}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring" }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </motion.button>
          )}
          
          <motion.button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={handleCreateNewProperty}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus className="mr-2" />
            Add Property
          </motion.button>
        </div>
      </div>

      <PropertyFilters 
        properties={properties} 
        onFilterApply={applyFilters} 
      />

      <div className="mt-4 mb-6">
        <h3 className="font-semibold mb-2">Column Visibility</h3>
        <div className="flex flex-wrap gap-2">
          {allColumns.map(column => (
            <button
              key={column}
              onClick={() => toggleColumnVisibility(column)}
              className={`px-3 py-1 text-xs rounded-full ${
                visibleColumns[column] 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {column}
            </button>
          ))}
        </div>
      </div>

      <PropertyTable 
        properties={filteredProperties} 
        visibleColumns={visibleColumns}
        onUpdate={handlePropertyUpdate}
      />

      {/* Property Editor for creating new properties */}
      {isCreatingProperty && (
        <PropertyEditor
          property={{
            "OFFER NO": "NEW-PROPERTY",
            "Property Location": "",
            "District": "",
            "City__1": "",
            "Status": "FOR SALE",
            "Type": "",
            "TOTAL PRICE": 0,
            "Plot Area Sq. Ft.": 0,
            "GFA Sq. Ft.": 0,
            "Usage": "",
            "Proposed Height Letters": "",
            "FAR": 0,
            "Freehold": "No",
            "PRICE PER SQ FT PLOT": 0,
            "PRICE PER SQ FT GFA": 0,
            "Location Pin": ""
          }}
          onClose={() => setIsCreatingProperty(false)}
          onSave={(newProperty) => {
            setIsCreatingProperty(false);
            handlePropertyUpdate('create', newProperty);
          }}
          onDelete={() => setIsCreatingProperty(false)}
          isNewProperty={true}
        />
      )}
    </div>
  );
};

export default PropertyTab;