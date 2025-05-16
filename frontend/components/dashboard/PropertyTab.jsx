// frontend/components/dashboard/PropertyTab.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import PropertyTable from './PropertyTable';
import PropertyFilters from './PropertyFilters';

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

  // Sample property fields (dynamically generate complete list from data)
  const [allColumns, setAllColumns] = useState([]);

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
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

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
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Properties Management</h2>
        <p className="text-gray-600">
          Manage and filter your property listings. Toggle columns, apply advanced filters, and more.
        </p>
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
      />
    </div>
  );
};

export default PropertyTab;