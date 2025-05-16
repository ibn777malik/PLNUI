// components/PropertyCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaImage } from 'react-icons/fa';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  hover: { scale: 1.03, boxShadow: '0px 10px 30px rgba(0,0,0,0.1)' },
};

const priceVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { delay: 0.3 } },
  hover: { scale: 1.1 },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const PropertyCard = ({ property }) => {
  const location = property['Property Location'] || 'Untitled Plot';
  const district = property['District'] || '';
  const city = property['City__1'] || '';
  const price = property['TOTAL PRICE']
    ? `AED ${Number(property['TOTAL PRICE']).toLocaleString()}`
    : 'Price on Request';
  const offerNo = property['OFFER NO'];
  const imgUrl = property.imageUrl;  // passed in from parent

  return (
    <motion.div
      className="bg-white border-2 border-red-600 rounded-2xl overflow-hidden cursor-pointer"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {/* Offer image */}
      <div className="relative h-48 w-full">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={location}
            className="w-full h-full object-cover"
            onError={e => { e.currentTarget.src = 'https://via.placeholder.com/640x480?text=No+Image'; }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <FaImage className="text-gray-400 text-4xl" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800">{location}</h3>
        <p className="text-gray-600 text-sm mb-3">
          {district} <span className="mx-1">·</span> {city}
        </p>

        <motion.div
          variants={priceVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <span className="inline-block bg-red-600 text-white font-bold text-lg px-3 py-1 rounded-md">
            {price}
          </span>
        </motion.div>

        <Link href={`/properties/${offerNo}`}>
          <motion.a
            className="block mt-4 text-center uppercase font-semibold tracking-wider px-6 py-2 border-2 border-red-600 rounded-lg text-red-600 bg-white"
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
