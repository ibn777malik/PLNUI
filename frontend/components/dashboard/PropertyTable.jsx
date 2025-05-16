// frontend/components/dashboard/PropertyTable.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaSort, FaSortUp, FaSortDown, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import PropertyEditor from './PropertyEditor';

const PropertyTable = ({ properties, visibleColumns, onUpdate }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'OFFER NO',
    direction: 'ascending'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  // Add state to track the property being edited
  const [editingProperty, setEditingProperty] = useState(null);
  
  // Formatting functions
  const formatValue = (value, column) => {
    if (value === undefined || value === null) return "-";
    
    // Format specific columns
    if (column === 'TOTAL PRICE' || column === 'PRICE PER SQ FT PLOT' || column === 'PRICE PER SQ FT GFA') {
      return typeof value === 'number' ? `AED ${value.toLocaleString()}` : value;
    }
    
    if (column.includes('Sq. Ft.') || column.includes('Sq. M.')) {
      return typeof value === 'number' ? `${value.toLocaleString()}` : value;
    }
    
    return value;
  };
  
  // Sorting logic
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const sortedProperties = React.useMemo(() => {
    if (!properties) return [];
    
    let sortableProperties = [...properties];
    if (sortConfig.key) {
      sortableProperties.sort((a, b) => {
        // Handle null/undefined values
        if (a[sortConfig.key] === undefined || a[sortConfig.key] === null) return 1;
        if (b[sortConfig.key] === undefined || b[sortConfig.key] === null) return -1;
        
        // Sorting based on type
        if (typeof a[sortConfig.key] === 'number' && typeof b[sortConfig.key] === 'number') {
          return sortConfig.direction === 'ascending'
            ? a[sortConfig.key] - b[sortConfig.key]
            : b[sortConfig.key] - a[sortConfig.key];
        } else {
          // String comparison
          return sortConfig.direction === 'ascending'
            ? String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key]))
            : String(b[sortConfig.key]).localeCompare(String(a[sortConfig.key]));
        }
      });
    }
    return sortableProperties;
  }, [properties, sortConfig]);
  
  // Pagination
  const paginatedProperties = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedProperties.slice(startIndex, startIndex + pageSize);
  }, [sortedProperties, currentPage, pageSize]);
  
  const totalPages = Math.ceil((properties?.length || 0) / pageSize);
  
  const pageSizeOptions = [5, 10, 25, 50, 100];
  
  // Handle row selection
  const toggleRowSelection = (id) => {
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const toggleAllRows = () => {
    if (selectedRows.length === paginatedProperties.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedProperties.map(row => row["OFFER NO"]));
    }
  };
  
  // Handle edit property
  const handleEditProperty = (property) => {
    setEditingProperty(property);
  };
  
  // Handle property update
  const handlePropertyUpdate = (updatedProperty, images) => {
    if (onUpdate) {
      onUpdate('update', updatedProperty, images);
    }
    setEditingProperty(null);
  };
  
  // Handle close property editor
  const handleCloseEditor = () => {
    setEditingProperty(null);
  };
  
  // Handle delete property
  const handleDeleteProperty = (propertyId) => {
    if (onUpdate) {
      onUpdate('delete', propertyId);
    }
  };
  
  // Generate visible column keys
  const visibleColumnKeys = Object.keys(visibleColumns).filter(key => visibleColumns[key]);
  
  if (!properties || properties.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-md text-center">
        <p className="text-gray-500">No properties found.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, properties.length)} of {properties.length} entries
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Show entries:</label>
          <select 
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing page size
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto border border-gray-200 rounded-md shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input 
                  type="checkbox" 
                  checked={paginatedProperties.length > 0 && selectedRows.length === paginatedProperties.length}
                  onChange={toggleAllRows}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              
              {visibleColumnKeys.map((column) => (
                <th 
                  key={column}
                  onClick={() => requestSort(column)}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>{column}</span>
                    {sortConfig.key === column ? (
                      sortConfig.direction === 'ascending' ? (
                        <FaSortUp className="text-blue-600" />
                      ) : (
                        <FaSortDown className="text-blue-600" />
                      )
                    ) : (
                      <FaSort className="text-gray-400" />
                    )}
                  </div>
                </th>
              ))}
              
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProperties.map((property, index) => (
              <motion.tr 
                key={property["OFFER NO"] || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={
                  selectedRows.includes(property["OFFER NO"]) 
                    ? "bg-blue-50" 
                    : "hover:bg-gray-50"
                }
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.includes(property["OFFER NO"])}
                    onChange={() => toggleRowSelection(property["OFFER NO"])}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                
                {visibleColumnKeys.map((column) => (
                  <td key={column} className="px-4 py-3 whitespace-nowrap">
                    {column === "Status" ? (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        property[column] === "FOR SALE" 
                          ? "bg-green-100 text-green-800" 
                          : property[column] === "SOLD" 
                          ? "bg-red-100 text-red-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {property[column]}
                      </span>
                    ) : (
                      formatValue(property[column], column)
                    )}
                  </td>
                ))}
                
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <Link href={`/properties/${property["OFFER NO"]}`} className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100">
                      <FaEye size={16} title="View" />
                    </Link>
                    <button 
                      className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100"
                      onClick={() => handleEditProperty(property)}
                    >
                      <FaEdit size={16} title="Edit" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                      onClick={() => handleDeleteProperty(property["OFFER NO"])}
                    >
                      <FaTrash size={16} title="Delete" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div>
          {selectedRows.length > 0 && (
            <div className="text-sm">
              {selectedRows.length} {selectedRows.length === 1 ? 'row' : 'rows'} selected
              <button className="ml-4 text-blue-600 hover:text-blue-800">Export Selected</button>
              <button className="ml-4 text-red-600 hover:text-red-800">Delete Selected</button>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
          >
            First
          </button>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Calculate page numbers to show
              let pageNum = currentPage;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 border border-gray-300 rounded-md text-sm ${
                    currentPage === pageNum ? 'bg-blue-600 text-white' : ''
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
          >
            Next
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </div>
      
      {/* Property Editor Modal */}
      {editingProperty && (
        <PropertyEditor
          property={editingProperty}
          onClose={handleCloseEditor}
          onSave={handlePropertyUpdate}
          onDelete={handleDeleteProperty}
        />
      )}
    </div>
  );
};

export default PropertyTable;