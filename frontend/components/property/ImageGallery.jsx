// frontend/components/property/ImageGallery.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
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

const ImageGallery = ({ images, isOpen, onClose, initialSlide = 0 }) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    beforeChange: (_, next) => setCurrentSlide(next),
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 text-white">
        <h3 className="text-xl font-semibold">Property Images</h3>
        <div className="flex items-center space-x-4">
          <span>{currentSlide + 1} / {images.length}</span>
          <motion.button
            onClick={onClose}
            className="bg-red-600 text-white p-2 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <Slider {...settings}>
            {images.map((image, index) => (
              <div key={index} className="outline-none">
                <div className="flex items-center justify-center h-[70vh]">
                  <img
                    src={image.url}
                    alt={image.description || `Property image ${index + 1}`}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/1200x800?text=Image+Not+Available';
                    }}
                  />
                </div>
                {image.description && (
                  <div className="text-white text-center mt-4 px-4 py-2 bg-black bg-opacity-50 rounded">
                    {image.description}
                  </div>
                )}
              </div>
            ))}
          </Slider>
        </div>
      </div>
      
      <div className="p-4 overflow-x-auto hide-scrollbar">
        <div className="flex space-x-2">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className={`w-24 h-24 flex-shrink-0 rounded overflow-hidden cursor-pointer ${
                currentSlide === index ? 'ring-4 ring-red-600' : 'opacity-60'
              }`}
              whileHover={{ opacity: 1 }}
              onClick={() => {
                const slider = document.querySelector('.slick-slider');
                if (slider && slider.slick) {
                  slider.slick.slickGoTo(index);
                }
              }}
            >
              <img
                src={image.url}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/160x160?text=Image';
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;