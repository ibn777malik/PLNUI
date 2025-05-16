// components/PremiumOpportunitiesSection.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Slider from 'react-slick';
import apiUtils from '../utils/apiUtils';
import PropertyCard from './PropertyCard';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const { getPropertyImages } = apiUtils;

const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 640,  settings: { slidesToShow: 1 } },
  ],
};

const PremiumOpportunitiesSection = ({ properties = [] }) => {
  // sort and pick top 5 by price
  const topOffers = [...properties]
    .sort((a, b) => Number(b['TOTAL PRICE']) - Number(a['TOTAL PRICE']))
    .slice(0, 5);

  const [offers, setOffers] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function loadImages() {
      const withImages = await Promise.all(
        topOffers.map(async (prop) => {
          try {
            const resp = await getPropertyImages(prop['OFFER NO']);
            const url = resp.images?.[0]?.url || null;
            return { ...prop, imageUrl: url };
          } catch {
            return { ...prop, imageUrl: null };
          }
        })
      );
      if (mounted) setOffers(withImages);
    }
    loadImages();
    return () => { mounted = false; };
  }, [properties]);

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {offers.length > 0 && (
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <video
                autoPlay loop muted playsInline
                className="w-full h-full object-cover"
                src={
                  offers[activeSlide]?.videoUrl ||
                  'https://raw.githubusercontent.com/AbdallaMalik/PlanetLand/master/Featured.mp4'
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Foreground */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Header in white box */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block bg-white px-8 py-6 rounded-md mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-black">Premium </span>
              <span className="text-red-600">Opportunities</span>
            </h2>
            <motion.div
              className="w-24 h-1 bg-red-600 mx-auto mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of exclusive properties in the most prestigious areas of Dubai
            </p>
          </div>
        </motion.div>

        {/* Offers Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Slider
            {...sliderSettings}
            beforeChange={(_, next) => setActiveSlide(next)}
          >
            {offers.map((offer, idx) => (
              <div key={offer['OFFER NO'] || idx} className="px-4">
                <PropertyCard property={offer} />
              </div>
            ))}
          </Slider>
        </motion.div>

        {/* “Explore All Properties” button */}
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
                <span>Explore All Properties</span>
                <motion.svg
                  className="w-5 h-5 ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </span>
              <motion.span
                className="absolute inset-0 bg-red-600 origin-left z-0"
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

export default PremiumOpportunitiesSection;
