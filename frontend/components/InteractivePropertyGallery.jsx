import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import Link from 'next/link';

const InteractivePropertyGallery = ({ properties }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);
  
  // Handle click on property card
  const handleCardClick = (property) => {
    if (!dragging) {
      setSelectedProperty(property);
    }
  };

  // Close detail view
  const closeDetail = () => {
    setSelectedProperty(null);
  };

  // Calculate if dragging is happening
  const handleDragStart = () => {
    setDragging(true);
  };

  const handleDragEnd = () => {
    setTimeout(() => {
      setDragging(false);
    }, 100);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-black">Browse Our </span>
            <span className="text-red-600">Property Portfolio</span>
          </h2>
          <motion.div 
            className="w-24 h-1 bg-red-600 mx-auto my-6"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Drag to explore our exclusive real estate listings with our interactive gallery
          </p>
        </motion.div>

        {/* Interactive gallery with horizontal drag */}
        <div className="overflow-hidden">
          <motion.div
            ref={containerRef}
            className="flex space-x-8 py-4 px-4 cursor-grab"
            drag="x"
            dragConstraints={containerRef}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            whileTap={{ cursor: "grabbing" }}
          >
            {properties.map((property, index) => (
              <motion.div
                key={property["OFFER NO"]}
                variants={cardVariants}
                className="relative flex-shrink-0 w-72 h-96 overflow-hidden rounded-xl"
                onClick={() => handleCardClick(property)}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={`https://source.unsplash.com/random/600x800?dubai,real,estate,${property["Property Location"]}`}
                  alt={property["Property Location"]}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                  <div className="bg-red-600 text-white text-sm py-1 px-3 rounded-full mb-3 inline-block">
                    {property["Status"]}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{property["Property Location"] || "Untitled"}</h3>
                  <p className="text-sm text-gray-300 mb-2">{property["District"]} - {property["City__1"]}</p>
                  <p className="font-bold text-lg">
                    AED {property["TOTAL PRICE"].toLocaleString()}
                  </p>
                </div>
                
                {/* Interaction hint */}
                <motion.div 
                  className="absolute top-4 right-4 bg-white bg-opacity-90 text-black text-xs py-1 px-2 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  Click for details
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Drag instructions */}
        <motion.div 
          className="flex justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center text-gray-500">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span>Drag to explore more properties</span>
          </div>
        </motion.div>

        {/* Full property detail modal */}
        <AnimatePresence>
          {selectedProperty && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDetail}
            >
              <motion.div
                className="bg-white rounded-xl w-full max-w-4xl overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-72 md:h-96">
                  <img
                    src={`https://source.unsplash.com/random/1200x800?dubai,property,${selectedProperty["Property Location"]}`}
                    alt={selectedProperty["Property Location"]}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60" />
                  
                  <button 
                    onClick={closeDetail}
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap justify-between items-start mb-6">
                    <div>
                      <div className="bg-red-600 text-white text-sm py-1 px-3 rounded-full mb-3 inline-block">
                        {selectedProperty["Status"]}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">
                        {selectedProperty["Property Location"] || "Untitled Plot"}
                      </h3>
                      <p className="text-gray-600">{selectedProperty["District"]} - {selectedProperty["City__1"]}</p>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      <p className="text-3xl font-bold text-red-600">
                        AED {selectedProperty["TOTAL PRICE"].toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 text-sm">Plot Area</p>
                      <p className="text-lg font-bold">
                        {selectedProperty["Plot Area Sq. Ft"]?.toLocaleString() || "N/A"} sqft
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 text-sm">Usage</p>
                      <p className="text-lg font-bold">{selectedProperty["Usage"]}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 text-sm">Proposed Height</p>
                      <p className="text-lg font-bold">{selectedProperty["Proposed Height Letters"]}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 text-sm">GFA</p>
                      <p className="text-lg font-bold">
                        {selectedProperty["GFA Sq. Ft."]?.toLocaleString() || "N/A"} sqft
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 text-sm">Price per sq ft (Plot)</p>
                      <p className="text-lg font-bold">
                        AED {selectedProperty["PRICE PER SQ FT PLOT"]?.toLocaleString() || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-500 text-sm">Price per sq ft (GFA)</p>
                      <p className="text-lg font-bold">
                        AED {selectedProperty["PRICE PER SQ FT GFA"]?.toLocaleString() || "N/A"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Link href={`/properties/${selectedProperty["OFFER NO"]}`}>
                      <motion.button
                        className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>View Full Details</span>
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </motion.button>
                    </Link>
                    
                    <motion.button
                      className="bg-black text-white px-6 py-3 rounded-lg font-semibold flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>Contact Agent</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

// Interactive 3D location map
const LocationMap = () => {
  const mapRef = useRef(null);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };
  
  // Locations data
  const locations = [
    { id: 1, name: "Business Bay", x: "30%", y: "45%", scale: 1.2 },
    { id: 2, name: "Downtown Dubai", x: "35%", y: "35%", scale: 1 },
    { id: 3, name: "Dubai Marina", x: "15%", y: "65%", scale: 1.1 },
    { id: 4, name: "Palm Jumeirah", x: "20%", y: "55%", scale: 0.9 },
    { id: 5, name: "DIFC", x: "40%", y: "40%", scale: 1 }
  ];
  
  return (
    <section className="py-20 bg-white overflow-hidden">
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-black">Prime </span>
            <span className="text-red-600">Locations</span>
          </h2>
          <motion.div 
            className="w-24 h-1 bg-red-600 mx-auto my-6"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Explore Dubai's most prestigious areas where we offer exclusive property opportunities
          </p>
        </motion.div>

        {/* Interactive 3D Map */}
        <div className="relative h-[500px] bg-black rounded-xl overflow-hidden shadow-2xl perspective-1000">
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: "url(https://source.unsplash.com/random/1200x800?dubai,skyline,aerial)",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            initial={{ scale: 1.1, opacity: 0.5 }}
            whileInView={{ scale: 1, opacity: 0.7 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
          </motion.div>

          <div ref={mapRef} className="relative w-full h-full z-10">
            {/* Location pins */}
            {locations.map((location) => (
              <motion.div
                key={location.id}
                className="absolute"
                style={{ 
                  left: location.x,
                  top: location.y,
                }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: location.id * 0.15 }}
                whileHover={{ scale: 1.2, zIndex: 20 }}
              >
                <motion.div 
                  className="relative"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: location.id * 0.2 }}
                >
                  {/* Pin */}
                  <div className="relative">
                    <motion.div
                      className="w-4 h-4 rounded-full bg-red-600 mb-1"
                      animate={{ 
                        boxShadow: [
                          "0 0 0 0 rgba(220, 38, 38, 0.7)",
                          "0 0 0 10px rgba(220, 38, 38, 0)",
                        ]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.5, 
                        delay: location.id * 0.2 
                      }}
                    />
                    
                    {/* Pointer */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-2 h-2 bg-red-600 rotate-45" />
                  </div>
                  
                  {/* Label */}
                  <motion.div 
                    className="bg-white text-black text-xs py-1 px-2 rounded-lg shadow-lg whitespace-nowrap mt-2"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: location.id * 0.15 + 0.5 }}
                  >
                    {location.name}
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
          
          {/* Interactive elements */}
          <div className="absolute bottom-6 right-6 z-20">
            <div className="bg-white bg-opacity-90 rounded-lg p-3 shadow-lg text-sm">
              <p className="font-semibold mb-2">Our Premium Locations</p>
              <ul className="space-y-1">
                {locations.map((location) => (
                  <motion.li 
                    key={location.id}
                    className="flex items-center"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: location.id * 0.1 + 0.8 }}
                  >
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-2" />
                    {location.name}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export { InteractivePropertyGallery, LocationMap };