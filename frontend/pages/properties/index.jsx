// frontend/pages/properties/index.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Link from 'next/link';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PropertyCard from '../../components/PropertyCard';
import PropertyFilter from '../../components/PropertyFilter';
import ContactSidebar from '../../components/ContactSidebar';
import { FaArrowUp, FaMapMarkerAlt, FaList, FaThLarge, FaSpinner } from 'react-icons/fa';

// Map Component (can be expanded for actual map integration if needed)
const PropertyMap = ({ properties }) => {
  const mapRef = useRef(null);
  const isInView = useInView(mapRef, { once: true });

  return (
    <motion.div
      ref={mapRef}
      className="w-full h-[600px] bg-gray-200 rounded-xl overflow-hidden relative"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      {/* Simulated map background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(https://source.unsplash.com/random/1200x800?dubai,map)" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      {/* Property markers */}
      {properties.map((property, index) => (
        <motion.div
          key={property["OFFER NO"]}
          className="absolute z-10"
          style={{ 
            left: `${20 + (index * 5)}%`, 
            top: `${30 + (index * 8)}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
          whileHover={{ scale: 1.2, zIndex: 20 }}
        >
          <motion.div
            className="relative cursor-pointer"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
          >
            <motion.div
              className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white"
              whileHover={{ scale: 1.2 }}
            >
              <FaMapMarkerAlt />
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full bg-white text-black text-xs font-semibold py-1 px-2 rounded-lg shadow-md whitespace-nowrap opacity-0 pointer-events-none"
              whileHover={{ opacity: 1, y: 0 }}
            >
              {property["Property Location"]}
              <br />
              <span className="text-red-600 font-bold">
                {property["TOTAL PRICE"] ? `AED ${property["TOTAL PRICE"].toLocaleString()}` : "Price on Request"}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      ))}

      {/* Map overlay with property count and CTA */}
      <div className="absolute bottom-6 left-6 bg-white bg-opacity-90 rounded-lg p-4 shadow-lg max-w-xs">
        <h3 className="font-bold text-lg">Dubai Property Map</h3>
        <p className="text-sm text-gray-600 mt-1">Showing {properties.length} properties</p>
        <motion.button
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>View All Locations</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Main page component
export default function PropertiesIndex() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Stats for banner
  const stats = {
    totalProperties: 0,
    minPrice: 0,
    maxPrice: 0,
    averagePrice: 0
  };

  // Refs
  const scrollRef = useRef(null);
  const filterRef = useRef(null);

  // Fetch properties data
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        // Fetch all properties
        const response = await fetch('http://localhost:5000/api/properties');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        
        // Fetch images for each property
        const propertiesWithImages = await Promise.all(
          data.map(async (property) => {
            try {
              const imgResponse = await fetch(`http://localhost:5000/api/images/property/${property["OFFER NO"]}`);
              if (imgResponse.ok) {
                const imgData = await imgResponse.json();
                if (imgData.images && imgData.images.length > 0) {
                  // Make sure the image URL is absolute
                  const imgUrl = imgData.images[0].url.startsWith('http') 
                    ? imgData.images[0].url 
                    : `http://localhost:5000${imgData.images[0].url}`;
                  return { ...property, imageUrl: imgUrl };
                }
              }
              // Fallback to placeholder if no images
              return { ...property, imageUrl: `https://source.unsplash.com/random/400x300?dubai,property,${property["OFFER NO"]}` };
            } catch (err) {
              console.error(`Error fetching images for property ${property["OFFER NO"]}:`, err);
              // Fallback to placeholder
              return { ...property, imageUrl: `https://source.unsplash.com/random/400x300?dubai,property,${property["OFFER NO"]}` };
            }
          })
        );
        
        // Process and set properties
        if (propertiesWithImages && propertiesWithImages.length > 0) {
          setProperties(propertiesWithImages);
          setFilteredProperties(propertiesWithImages);
          
          // Calculate stats
          const prices = propertiesWithImages.map(p => Number(p["TOTAL PRICE"])).filter(p => !isNaN(p) && p > 0);
          stats.totalProperties = propertiesWithImages.length;
          stats.minPrice = Math.min(...prices);
          stats.maxPrice = Math.max(...prices);
          stats.averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
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

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle property filtering
  const handleFilterApply = (filters) => {
    // Begin with all properties
    let result = [...properties];
    
    // Apply filters
    if (filters.minPrice) {
      result = result.filter(p => p["TOTAL PRICE"] >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
      result = result.filter(p => p["TOTAL PRICE"] <= filters.maxPrice);
    }
    
    if (filters.district) {
      result = result.filter(p => p["District"]?.includes(filters.district));
    }
    
    if (filters.propertyType) {
      result = result.filter(p => p["Type"]?.includes(filters.propertyType));
    }
    
    if (filters.status) {
      result = result.filter(p => p["Status"]?.includes(filters.status));
    }
    
    setFilteredProperties(result);
    
    // Scroll to results if filter is applied
    if (filterRef.current) {
      filterRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-gray-300 border-t-red-600 rounded-full"
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg className="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Head>
        <title>Properties | Planet Land Real Estate</title>
        <meta name="description" content="Browse our exclusive property listings in Dubai's most prestigious locations." />
      </Head>
      
      {/* Fixed Header */}
      <Header />
      
      {/* Contact Sidebar */}
      <ContactSidebar />
      
      {/* Hero Banner */}
      <div className="relative h-[50vh] bg-black overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url(https://source.unsplash.com/random/1920x1080?dubai,skyline,night)",
            backgroundPosition: 'center 30%'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-70" />
        </div>
        
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              <span className="block">Discover</span>
              <span className="text-red-600">Premium Properties</span>
            </h1>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg mt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
                <div className="text-center p-3">
                  <div className="text-2xl md:text-3xl font-bold">{filteredProperties.length}</div>
                  <div className="text-sm opacity-80">Properties</div>
                </div>
                <div className="text-center p-3">
                  <div className="text-2xl md:text-3xl font-bold">
                    {stats.minPrice ? `${Math.floor(stats.minPrice / 1000000)}M` : 'N/A'}
                  </div>
                  <div className="text-sm opacity-80">Min. Price</div>
                </div>
                <div className="text-center p-3">
                  <div className="text-2xl md:text-3xl font-bold">
                    {stats.maxPrice ? `${Math.floor(stats.maxPrice / 1000000)}M` : 'N/A'}
                  </div>
                  <div className="text-sm opacity-80">Max. Price</div>
                </div>
                <div className="text-center p-3">
                  <div className="text-2xl md:text-3xl font-bold">
                    {stats.averagePrice ? `${Math.floor(stats.averagePrice / 1000000)}M` : 'N/A'}
                  </div>
                  <div className="text-sm opacity-80">Avg. Price</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Filter Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <PropertyFilter onFilter={handleFilterApply} />
        </div>
      </section>
      
      {/* Results Section */}
      <section ref={filterRef} className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {/* Results header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              <span className="text-gray-800">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'}
              </span> Available
            </h2>
            
            <div className="flex items-center space-x-2">
              <div className="hidden md:flex items-center space-x-4 mr-4">
                <span className="text-gray-600">View:</span>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <FaThLarge />
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded ${viewMode === 'map' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <FaMapMarkerAlt />
                </button>
              </div>
              
              <select 
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md"
                defaultValue="newest"
              >
                <option value="newest">Newest First</option>
                <option value="price_high">Price (High to Low)</option>
                <option value="price_low">Price (Low to High)</option>
                <option value="size_high">Size (Largest First)</option>
              </select>
            </div>
          </div>
          
          {/* Properties display */}
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProperties.map((property, index) => (
                    <motion.div
                      key={property["OFFER NO"]}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.5 }}
                    >
                      <PropertyCard key={property["OFFER NO"]} property={property} />
                    </motion.div>
                  ))}
                </div>
                
                {filteredProperties.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4"
                    >
                      <FaList className="text-gray-400 text-3xl" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No properties found</h3>
                    <p className="text-gray-600">Try adjusting your filters to see more results</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <PropertyMap properties={filteredProperties} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Pagination */}
          {filteredProperties.length > 0 && (
            <div className="mt-12 flex justify-center">
              <div className="flex space-x-2">
                <button className="w-10 h-10 rounded-md bg-red-600 text-white flex items-center justify-center">1</button>
                <button className="w-10 h-10 rounded-md bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300">2</button>
                <button className="w-10 h-10 rounded-md bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300">3</button>
                <button className="w-10 h-10 rounded-md bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Call-to-Action Section */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-20" 
          style={{
            backgroundImage: 'url(https://source.unsplash.com/random/1920x1080?dubai,city)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Can't Find What You're Looking For?
            </motion.h2>
            
            <motion.p 
              className="text-xl mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Let our expert team help you find the perfect property for your needs
            </motion.p>
            
            <motion.button
              className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Our Team
            </motion.button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
      
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="fixed bottom-8 right-8 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-50"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}