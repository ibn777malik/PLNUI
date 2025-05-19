// frontend/components/property/SimilarProperties.jsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Slider arrow components
const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <motion.button
      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md text-gray-800 hover:text-red-600 focus:outline-none"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <FaChevronLeft />
    </motion.button>
  );
};

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <motion.button
      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md text-gray-800 hover:text-red-600 focus:outline-none"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <FaChevronRight />
    </motion.button>
  );
};

const SimilarProperties = ({ properties }) => {
  const containerRef = useRef();
  const isInView = useInView(containerRef, { once: true });

  // Safety check
  const validProperties = Array.isArray(properties) ? 
    properties.filter(p => p && typeof p === 'object' && p["OFFER NO"]) : [];

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  // Don't render anything if no valid properties
  if (validProperties.length === 0) return null;

  return (
    <motion.div
      ref={containerRef}
      className="mt-20"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-3xl font-bold mb-8">Similar Properties</h2>
      
      <Slider {...settings}>
        {validProperties.map((property) => (
          <div key={property["OFFER NO"]} className="px-4">
            <Link href={`/properties/${property["OFFER NO"]}`} className="block">
              <motion.div
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
                whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative h-48">
                  <img
                    src={property.imageUrl || `https://source.unsplash.com/random/640x480?dubai,real,estate,${property["OFFER NO"]}`}
                    alt={property["Property Location"]}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://source.unsplash.com/random/640x480?dubai,real,estate,${property["OFFER NO"]}`;
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    {property["Status"] || "FOR SALE"}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{property["Property Location"]}</h3>
                  <p className="text-gray-600 text-sm mb-2">{property["District"]}, {property["City__1"]}</p>
                  <p className="text-red-600 font-bold">
                    {typeof property["TOTAL PRICE"] === 'number' 
                      ? `AED ${property["TOTAL PRICE"].toLocaleString()}`
                      : 'Price on Request'
                    }
                  </p>
                </div>
              </motion.div>
            </Link>
          </div>
        ))}
      </Slider>
    </motion.div>
  );
};

export default SimilarProperties;