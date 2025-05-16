// frontend/components/dashboard/PropertyFilters.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PropertyFilters = ({ properties, onFilterApply }) => {
  const [isBasicFilterOpen, setIsBasicFilterOpen] = useState(true);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  
  // Basic filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [areaRange, setAreaRange] = useState({ min: '', max: '' });
  
  // Advanced filter state
  const [advancedFilters, setAdvancedFilters] = useState([
    { field: '', operator: 'contains', value: '' }
  ]);
  
  // Dropdown options based on data
  const statusOptions = useMemo(() => {
    if (!properties) return [];
    const statuses = [...new Set(properties.map(p => p.Status).filter(Boolean))];
    return statuses.sort();
  }, [properties]);
  
  const typeOptions = useMemo(() => {
    if (!properties) return [];
    const types = [...new Set(properties.map(p => p.Type).filter(Boolean))];
    return types.sort();
  }, [properties]);
  
  const districtOptions = useMemo(() => {
    if (!properties) return [];
    const districts = [...new Set(properties.map(p => p.District).filter(Boolean))];
    return districts.sort();
  }, [properties]);
  
  const locationOptions = useMemo(() => {
    if (!properties) return [];
    const locations = [...new Set(properties.map(p => p["Property Location"]).filter(Boolean))];
    return locations.sort();
  }, [properties]);
  
  // Get all available fields for filtering
  const filterableFields = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    
    // Get the first property to extract all possible fields
    const fields = Object.keys(properties[0]);
    return fields.filter(field => 
      // Filter out fields that don't make sense for filtering
      !field.includes('Created Date') && 
      !field.includes('Last Contact') &&
      !field.includes('Assigned') &&
      !field.includes('Tags') &&
      !field.includes('Lead value') &&
      !field.includes('Phone')
    );
  }, [properties]);
  
  // Apply filters to properties
  useEffect(() => {
    if (!properties) return;
    
    let filteredData = [...properties];
    
    // Apply basic filters
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filteredData = filteredData.filter(property => {
        return Object.values(property).some(value => 
          value && 
          String(value).toLowerCase().includes(searchTermLower)
        );
      });
    }
    
    if (selectedStatus) {
      filteredData = filteredData.filter(property => 
        property.Status === selectedStatus
      );
    }
    
    if (selectedType) {
      filteredData = filteredData.filter(property => 
        property.Type === selectedType
      );
    }
    
    if (selectedDistrict) {
      filteredData = filteredData.filter(property => 
        property.District === selectedDistrict
      );
    }
    
    if (selectedLocation) {
      filteredData = filteredData.filter(property => 
        property["Property Location"] === selectedLocation
      );
    }
    
    if (priceRange.min) {
      filteredData = filteredData.filter(property => 
        property['TOTAL PRICE'] >= Number(priceRange.min)
      );
    }
    
    if (priceRange.max) {
      filteredData = filteredData.filter(property => 
        property['TOTAL PRICE'] <= Number(priceRange.max)
      );
    }
    
    if (areaRange.min) {
      filteredData = filteredData.filter(property => 
        property['Plot Area Sq. Ft.'] >= Number(areaRange.min)
      );
    }
    
    if (areaRange.max) {
      filteredData = filteredData.filter(property => 
        property['Plot Area Sq. Ft.'] <= Number(areaRange.max)
      );
    }
    
    // Apply advanced filters
    if (advancedFilters.length > 0 && isAdvancedFilterOpen) {
      filteredData = filteredData.filter(property => {
        return advancedFilters.every(filter => {
          if (!filter.field || !filter.value) return true;
          
          const propertyValue = property[filter.field];
          const filterValue = filter.value;
          
          switch (filter.operator) {
            case 'contains':
              return String(propertyValue).toLowerCase().includes(filterValue.toLowerCase());
            case 'equals':
              return String(propertyValue) === filterValue;
            case 'not_equals':
              return String(propertyValue) !== filterValue;
            case 'greater_than':
              return Number(propertyValue) > Number(filterValue);
            case 'less_than':
              return Number(propertyValue) < Number(filterValue);
            case 'starts_with':
              return String(propertyValue).toLowerCase().startsWith(filterValue.toLowerCase());
            case 'ends_with':
              return String(propertyValue).toLowerCase().endsWith(filterValue.toLowerCase());
            default:
              return true;
          }
        });
      });
    }
    
    onFilterApply({ filteredData });
  }, [
    properties, searchTerm, selectedStatus, selectedType, selectedLocation,
    selectedDistrict, priceRange, areaRange, advancedFilters, isAdvancedFilterOpen, onFilterApply
  ]);
  
  // Add a new filter in advanced mode
  const addAdvancedFilter = () => {
    setAdvancedFilters([...advancedFilters, { field: '', operator: 'contains', value: '' }]);
  };
  
  // Remove a filter in advanced mode
  const removeAdvancedFilter = (index) => {
    const updatedFilters = advancedFilters.filter((_, i) => i !== index);
    setAdvancedFilters(updatedFilters);
  };
  
  // Update advanced filter
  const updateAdvancedFilter = (index, field, value) => {
    const updatedFilters = [...advancedFilters];
    updatedFilters[index] = { ...updatedFilters[index], [field]: value };
    setAdvancedFilters(updatedFilters);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedType('');
    setSelectedDistrict('');
    setSelectedLocation('');
    setPriceRange({ min: '', max: '' });
    setAreaRange({ min: '', max: '' });
    setAdvancedFilters([{ field: '', operator: 'contains', value: '' }]);
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-6">
      {/* Basic Filters */}
      <div 
        className="px-4 py-3 flex justify-between items-center border-b border-gray-200 cursor-pointer"
        onClick={() => setIsBasicFilterOpen(!isBasicFilterOpen)}
      >
        <h3 className="font-semibold text-gray-700">Basic Filters</h3>
        <span className="text-gray-500">{isBasicFilterOpen ? '−' : '+'}</span>
      </div>
      
      <AnimatePresence>
        {isBasicFilterOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search properties..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Status filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              {/* Type filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  {typeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              {/* District filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Districts</option>
                  {districtOptions.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
              
              {/* Location filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Locations</option>
                  {locationOptions.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range (AED)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Area Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plot Area Range (sq ft)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={areaRange.min}
                    onChange={(e) => setAreaRange({ ...areaRange, min: e.target.value })}
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={areaRange.max}
                    onChange={(e) => setAreaRange({ ...areaRange, max: e.target.value })}
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Advanced Filters */}
      <div 
        className="px-4 py-3 flex justify-between items-center border-b border-gray-200 cursor-pointer"
        onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
      >
        <h3 className="font-semibold text-gray-700">Advanced Filters</h3>
        <span className="text-gray-500">{isAdvancedFilterOpen ? '−' : '+'}</span>
      </div>
      
      <AnimatePresence>
        {isAdvancedFilterOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              {advancedFilters.map((filter, index) => (
                <div key={index} className="flex items-center space-x-3 mb-3">
                  {/* Field selector */}
                  <select
                    value={filter.field}
                    onChange={(e) => updateAdvancedFilter(index, 'field', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select field</option>
                    {filterableFields.map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                  
                  {/* Operator selector */}
                  <select
                    value={filter.operator}
                    onChange={(e) => updateAdvancedFilter(index, 'operator', e.target.value)}
                    className="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="contains">Contains</option>
                    <option value="equals">Equals</option>
                    <option value="not_equals">Not Equals</option>
                    <option value="greater_than">Greater Than</option>
                    <option value="less_than">Less Than</option>
                    <option value="starts_with">Starts With</option>
                    <option value="ends_with">Ends With</option>
                  </select>
                  
                  {/* Value input */}
                  <input
                    type="text"
                    value={filter.value}
                    onChange={(e) => updateAdvancedFilter(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  {/* Remove button */}
                  <button
                    onClick={() => removeAdvancedFilter(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              {/* Add filter button */}
              <div className="mt-4">
                <button
                  onClick={addAdvancedFilter}
                  className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                >
                  + Add Filter
                </button>
              </div>
              
              {/* Filter logic explanation */}
              <div className="mt-4 bg-gray-50 p-3 rounded-md text-sm text-gray-600">
                <p className="font-medium">Filter Logic</p>
                <p>All filters are combined with AND logic. Records must match all criteria to be displayed.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Action buttons */}
      <div className="px-4 py-3 border-t border-gray-200 flex justify-end space-x-3">
        <button
          onClick={resetFilters}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Reset Filters
        </button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Apply Filters
        </motion.button>
      </div>
    </div>
  );
};

export default PropertyFilters;