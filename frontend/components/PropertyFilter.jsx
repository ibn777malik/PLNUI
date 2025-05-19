import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PropertyFilter = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    country: '',
    minPrice: '',
    maxPrice: '',
    offerNo: '',
    live: [],
    city1: '',
    type: '',
    propertyLocation: '',
    district: '',
    freehold: '',
    minPlotAreaSqFt: '',
    maxPlotAreaSqFt: '',
    minPlotAreaSqM: '',
    maxPlotAreaSqM: '',
    usage: '',
    minProposedHeight: '',
    maxProposedHeight: '',
    minGfaSqFt: '',
    maxGfaSqFt: '',
    minGfaSqM: '',
    maxGfaSqM: '',
    minBuaSqFt: '',
    maxBuaSqFt: '',
    minBuaSqM: '',
    maxBuaSqM: '',
    minFar: '',
    maxFar: '',
    minPricePerSqFtPlot: '',
    maxPricePerSqFtPlot: '',
    minPricePerSqFtGfa: '',
    maxPricePerSqFtGfa: '',
    status: '',
    tags: []
  });

  const districts = ["BUSINESS BAY", "BURJ KHALIFA", "DOWNTOWN DUBAI", "DUBAI MARINA"];
  const propertyTypes = ["Plot", "Commercial", "Residential", "Mixed Use"];
  const statuses = ["FOR SALE", "SOLD", "Request"];
  const liveOptions = ["Website", "BOT"];
  const freeholdOptions = ["Freehold", "Non-Freehold"];
  const usageOptions = ["Mixed Use", "Residential", "Commercial", "Industrial"];
  const tagOptions = ["Land", "Development", "Investment", "Prime Location"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFilters(prev => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value)
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters({
      city: '',
      state: '',
      country: '',
      minPrice: '',
      maxPrice: '',
      offerNo: '',
      live: [],
      city1: '',
      type: '',
      propertyLocation: '',
      district: '',
      freehold: '',
      minPlotAreaSqFt: '',
      maxPlotAreaSqFt: '',
      minPlotAreaSqM: '',
      maxPlotAreaSqM: '',
      usage: '',
      minProposedHeight: '',
      maxProposedHeight: '',
      minGfaSqFt: '',
      maxGfaSqFt: '',
      minGfaSqM: '',
      maxGfaSqM: '',
      minBuaSqFt: '',
      maxBuaSqFt: '',
      minBuaSqM: '',
      maxBuaSqM: '',
      minFar: '',
      maxFar: '',
      minPricePerSqFtPlot: '',
      maxPricePerSqFtPlot: '',
      minPricePerSqFtGfa: '',
      maxPricePerSqFtGfa: '',
      status: '',
      tags: []
    });
    onFilter({});
    setShowAdvanced(false);
  };

  return (
    <div className="mb-8 px-4 max-w-7xl mx-auto">
      <motion.button
        className="flex items-center justify-center w-full md:w-auto bg-gradient-to-r from-red-600 to-black text-white px-6 py-3 rounded-lg font-semibold transition-colors hover:from-red-700 hover:to-gray-900"
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
          className="mt-4 bg-white rounded-lg shadow-xl p-6"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Basic Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleChange}
                  placeholder="e.g., Dubai"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={filters.state}
                  onChange={handleChange}
                  placeholder="e.g., Dubai"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={filters.country}
                  onChange={handleChange}
                  placeholder="e.g., UAE"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (AED)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleChange}
                    placeholder="Min"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleChange}
                    placeholder="Max"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <select
                  name="district"
                  value={filters.district}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
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
                  name="type"
                  value={filters.type}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Offer Number</label>
                <input
                  type="number"
                  name="offerNo"
                  value={filters.offerNo}
                  onChange={handleChange}
                  placeholder="e.g., 2"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="bg-gradient-to-r from-red-600 to-black text-white px-4 py-2 rounded-md font-medium hover:from-red-700 hover:to-gray-900"
              >
                {showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
              </button>
            </div>

            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City (Alt)</label>
                  <input
                    type="text"
                    name="city1"
                    value={filters.city1}
                    onChange={handleChange}
                    placeholder="e.g., DUBAI"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Location</label>
                  <input
                    type="text"
                    name="propertyLocation"
                    value={filters.propertyLocation}
                    onChange={handleChange}
                    placeholder="e.g., Business Bay"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Freehold</label>
                  <select
                    name="freehold"
                    value={filters.freehold}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">All</option>
                    {freeholdOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usage</label>
                  <select
                    name="usage"
                    value={filters.usage}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">All Usages</option>
                    {usageOptions.map(usage => (
                      <option key={usage} value={usage}>{usage}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plot Area (Sq. Ft.)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name="minPlotAreaSqFt"
                      value={filters.minPlotAreaSqFt}
                      onChange={handleChange}
                      placeholder="Min"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="number"
                      name="maxPlotAreaSqFt"
                      value={filters.maxPlotAreaSqFt}
                      onChange={handleChange}
                      placeholder="Max"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plot Area (Sq. M.)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name="minPlotAreaSqM"
                      value={filters.minPlotAreaSqM}
                      onChange={handleChange}
                      placeholder="Min"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="number"
                      name="maxPlotAreaSqM"
                      value={filters.maxPlotAreaSqM}
                      onChange={handleChange}
                      placeholder="Max"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GFA (Sq. Ft.)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name="minGfaSqFt"
                      value={filters.minGfaSqFt}
                      onChange={handleChange}
                      placeholder="Min"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="number"
                      name="maxGfaSqFt"
                      value={filters.maxGfaSqFt}
                      onChange={handleChange}
                      placeholder="Max"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GFA (Sq. M.)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name="minGfaSqM"
                      value={filters.minGfaSqM}
                      onChange={handleChange}
                      placeholder="Min"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="number"
                      name="maxGfaSqM"
                      value={filters.maxGfaSqM}
                      onChange={handleChange}
                      placeholder="Max"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">BUA (Sq. Ft.)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name="minBuaSqFt"
                      value={filters.minBuaSqFt}
                      onChange={handleChange}
                      placeholder="Min"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="number"
                      name="maxBuaSqFt"
                      value={filters.maxBuaSqFt}
                      onChange={handleChange}
                      placeholder="Max"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">BUA (Sq. M.)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name="minBuaSqM"
                      value={filters.minBuaSqM}
                      onChange={handleChange}
                      placeholder="Min"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="number"
                      name="maxBuaSqM"
                      value={filters.maxBuaSqM}
                      onChange={handleChange}
                      placeholder="Max"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">FAR</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name="minFar"
                      value={filters.minFar}
                      onChange={handleChange}
                      placeholder="Min"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="number"
                      name="maxFar"
                      value={filters.maxFar}
                      onChange={handleChange}
                      placeholder="Max"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Sq. Ft. (Plot)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name="minPricePerSqFtPlot"
                      value={filters.minPricePerSqFtPlot}
                      onChange={handleChange}
                      placeholder="Min"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="number"
                      name="maxPricePerSqFtPlot"
                      value={filters.maxPricePerSqFtPlot}
                      onChange={handleChange}
                      placeholder="Max"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Sq. Ft. (GFA)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name="minPricePerSqFtGfa"
                      value={filters.minPricePerSqFtGfa}
                      onChange={handleChange}
                      placeholder="Min"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="number"
                      name="maxPricePerSqFtGfa"
                      value={filters.maxPricePerSqFtGfa}
                      onChange={handleChange}
                      placeholder="Max"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Height</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name="minProposedHeight"
                      value={filters.minProposedHeight}
                      onChange={handleChange}
                      placeholder="Min"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                    <input
                      type="number"
                      name="maxProposedHeight"
                      value={filters.maxProposedHeight}
                      onChange={handleChange}
                      placeholder="Max"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tagOptions.map(tag => (
                      <label key={tag} className="flex items-center">
                        <input
                          type="checkbox"
                          name="tags"
                          value={tag}
                          checked={filters.tags.includes(tag)}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        {tag}
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <motion.button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-black text-white rounded-md font-semibold hover:from-red-700 hover:to-gray-900"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset
              </motion.button>
              <motion.button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-black text-white rounded-md font-semibold hover:from-red-700 hover:to-gray-900"
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