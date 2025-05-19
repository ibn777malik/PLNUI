// components/FeaturedPropertiesSection.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Slider from 'react-slick';
import apiUtils from '../utils/apiUtils';
const { getPropertyImages } = apiUtils;

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaImage } from 'react-icons/fa';

// Reusable slider for the cards
const PropertySlider = ({ properties, onSlideChange }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (_, next) => onSlideChange(next),
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640,  settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Slider {...settings} className="relative z-10">
      {properties.map((property) => (
        <div key={property['OFFER NO']} className="px-4">
          <motion.div
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative h-64">
              {property.image ? (
                <img
                  src={property.image.url}
                  alt={property.image.description || property['Property Location'] || 'Property'}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = 'https://via.placeholder.com/640x480?text=No+Image'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <FaImage className="text-gray-400 text-4xl" />
                  <span className="ml-2 text-gray-500">No Image</span>
                </div>
              )}
              <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                {property.Status || 'FOR SALE'}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {property['Property Location'] || 'Unknown Location'}
              </h3>
              <p className="text-gray-600 mt-2">{property.Type || 'Unknown Type'}</p>
              <p className="text-red-600 font-bold mt-2">
                {property['TOTAL PRICE']
                  ? `AED ${property['TOTAL PRICE'].toLocaleString()}`
                  : 'Price on Request'}
              </p>
              <div className="mt-4 flex justify-between text-sm text-gray-500">
                <span>{property['Plot Area Sq. Ft.'] || 'N/A'} Sq. Ft.</span>
                <span>{property.City__1 || 'N/A'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      ))}
    </Slider>
  );
};

const FeaturedPropertiesSection = ({ properties = [] }) => {
  const [enhancedProperties, setEnhancedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // Load primary image for top 5 offers
  useEffect(() => {
    const fetchImages = async () => {
      if (!properties.length) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const withImages = await Promise.all(
          properties.slice(0, 5).map(async (p) => {
            try {
              const resp = await getPropertyImages(p['OFFER NO']);
              const imgs = resp.images || [];
              const primary = imgs.sort((a, b) => a.order - b.order)[0] || null;
              return { ...p, image: primary };
            } catch {
              return { ...p, image: null };
            }
          })
        );
        setEnhancedProperties(withImages);
      } catch (e) {
        console.error(e);
        setError('Failed to load images');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [properties]);

  // Early return if no properties
  if (!properties.length) return null;

  return (
    <section className="relative py-20 bg-gray-50 overflow-hidden">
      {/* Video Background at full opacity */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {enhancedProperties.length > 0 && (
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                src={
                  enhancedProperties[activeSlide]?.videoUrl ||
                  'https://raw.githubusercontent.com/AbdallaMalik/PlanetLand/master/Swhite.mp4'
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Foreground */}
      <div className="container relative mx-auto px-4 z-10">
        {/* Header wrapped in white padded box */}
        <motion.div
          className="text-center mb-16 relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block bg-white px-8 py-6 rounded-md mx-auto relative z-10">
            <motion.div
              className="inline-block relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-2">
                <span className="text-black">Featured </span>
                <span className="text-red-600">Properties</span>
              </h2>
              <motion.div
                className="absolute -bottom-3 left-0 right-0 h-3 bg-gray-100"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
              />
            </motion.div>

            <motion.div
              className="w-24 h-1 bg-red-600 mx-auto my-6"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9, duration: 0.6 }}
            />

            <motion.p
              className="text-gray-600 mt-4 max-w-2xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 }}
            >
              Browse our selection of premium properties with our interactive slider
            </motion.p>
          </div>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-8">
            <motion.div
              className="inline-block"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </motion.div>
            <p className="mt-2 text-gray-600">Loading properties…</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
          </div>
        )}

        {/* Property slider */}
        {!loading && !error && enhancedProperties.length > 0 && (
          <PropertySlider properties={enhancedProperties} onSlideChange={setActiveSlide} />
        )}

        {/* View All button */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link href="/properties">
            <motion.button
              className="relative overflow-hidden group bg-white border-2 border-red-600 text-red-600 px-8 py-3 rounded-md font-semibold transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center">
                <span>View All Properties</span>
                <motion.svg
                  className="w-5 h-5 ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </motion.svg>
              </span>
              <motion.span
                className="absolute inset-0 bg-red-600 transform origin-left z-0"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedPropertiesSection;
