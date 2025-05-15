import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Animation variants for card, price tag, and button
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  hover: { scale: 1.03, boxShadow: '0px 10px 30px rgba(0,0,0,0.5)' },
};

const priceVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { delay: 0.3 } },
  hover: { scale: 1.1 },
};

const buttonVariants = {
  hover: { scale: 1.05, backgroundColor: '#FFFFFF', color: '#000000' },
  tap: { scale: 0.95 },
};

const PropertyCard = ({ property }) => {
  const location = property['Property Location'] || 'Untitled Plot';
  const district = property['District'] || '';
  const city = property['City__1'] || '';
  const price = property['TOTAL PRICE']?.toLocaleString() || '0';
  const offerNo = property['OFFER NO'];

  return (
    <motion.div
      className="bg-black border-2 border-red-600 rounded-2xl overflow-hidden cursor-pointer"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-black p-4">
        <h3 className="text-white text-2xl font-extrabold tracking-wide uppercase">
          {location}
        </h3>
      </div>

      {/* Content */}
      <div className="p-5 text-white">
        <p className="text-gray-300 text-sm mb-2">
          {district} <span className="mx-1">·</span> {city}
        </p>

        <motion.div
          variants={priceVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <span className="inline-block bg-white text-black font-bold text-lg px-3 py-1 rounded-md">
            AED {price}
          </span>
        </motion.div>

        <Link href={`/properties/${offerNo}`}>
          <motion.a
            className="block mt-4 text-center uppercase font-semibold tracking-wider px-6 py-2 border-2 border-red-600 rounded-lg text-red-600"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            View Details
          </motion.a>
        </Link>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
