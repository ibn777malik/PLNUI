import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PropertyFilter = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    district: '',
    propertyType: '',
    status: ''
  });

  const districts = ["BUSINESS BAY", "BURJ KHALIFA", "DOWNTOWN DUBAI", "DUBAI MARINA"];
  const propertyTypes = ["Plot", "Commercial", "Residential", "Mixed Use"];
  const statuses = ["FOR SALE", "SOLD", "Request"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      district: '',
      propertyType: '',
      status: ''
    });
    onFilter({});
  };

  return (
    <div className="mb-8">
      <motion.button
        className="flex items-center justify-center w-full md:w-auto bg-black text-white px-6 py-3 rounded-md font-semibold transition-colors hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        {isOpen ? 'Hide Filters' : 'Filter Properties'}
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 bg-white rounded-lg shadow-lg p-6"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (AED)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleChange}
                    placeholder="Min"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleChange}
                    placeholder="Max"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <select
                  name="district"
                  value={filters.district}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">All Districts</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select
                  name="propertyType"
                  value={filters.propertyType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">All Types</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <motion.button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset
              </motion.button>
              <motion.button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply Filters
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default PropertyFilter;