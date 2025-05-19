// frontend/pages/properties/[id].jsx
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ContactSidebar from '../../components/ContactSidebar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  FaMapMarkedAlt,
  FaRuler,
  FaBuilding,
  FaCrown,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaShareAlt,
  FaArrowLeft,
  FaImage,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaStickyNote,
  FaDownload,
  FaCheckCircle,
  FaSpinner
} from 'react-icons/fa';

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

// Image Gallery Modal Component
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

// Property Inquiry Form
const InquiryForm = () => {
  const formRef = useRef();
  const isInView = useInView(formRef, { once: true });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <motion.div
      ref={formRef}
      className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-2xl font-bold mb-6">Interested in this property?</h3>
      
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="Your Name"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="Your Email"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="+971 5X XXX XXXX"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="I'm interested in this property. Please contact me with more information."
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2" />
                Sending Inquiry...
              </span>
            ) : (
              <span>Send Inquiry</span>
            )}
          </button>
        </form>
      ) : (
        <motion.div 
          className="text-center py-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
          <h4 className="text-xl font-bold mb-2">Thank You!</h4>
          <p className="text-gray-600 mb-6">
            Your inquiry has been submitted successfully. Our team will contact you shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition-colors"
          >
            Send Another Inquiry
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

// Similar Properties Component - FIXED VERSION
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

// Helper function to create placeholder images
function createPlaceholders(propertyData, count) {
  return Array(count).fill(null).map((_, i) => ({
    id: `placeholder-${i}`,
    url: `https://source.unsplash.com/random/800x600?dubai,property,${i+1}`,
    description: `${propertyData?.["Property Location"] || "Property"} View ${i+1}`
  }));
}

export default function PropertyDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const [similarProperties, setSimilarProperties] = useState([]);
  
  // Refs for animations
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  
  // State for main property image url (similar to how it works in similar properties)
  const [mainImageUrl, setMainImageUrl] = useState('');
  
  // Fetch property data - SIMPLIFIED VERSION
  useEffect(() => {
    if (!id) return;

    const fetchPropertyData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch property details
        const response = await fetch(`http://localhost:5000/api/properties/${id}`);
        if (!response.ok) {
          throw new Error('Property not found');
        }
        const propertyData = await response.json();
        setProperty(propertyData);
        
        // Fetch property images - SIMPLIFIED approach using exactly the same method as similar properties
        try {
          const imgResponse = await fetch(`http://localhost:5000/api/images/property/${id}`);
          if (imgResponse.ok) {
            const imgData = await imgResponse.json();
            console.log('Raw images data:', imgData);
            
            if (imgData.images && imgData.images.length > 0) {
              // Process MAIN IMAGE exactly like similar properties - just take the first image
              // This is the key difference - using same technique as similar properties (which works)
              const firstImage = imgData.images[0];
              if (firstImage && firstImage.url) {
                // Fix URL path by ensuring lowercase /uploads/
                const fixedUrl = typeof firstImage.url === 'string' ? 
                  firstImage.url.replace(/^\/Uploads\//i, '/uploads/') : '';
                
                const mainImgUrl = fixedUrl.startsWith('http') 
                  ? fixedUrl 
                  : `http://localhost:5000${fixedUrl}`;
                
                console.log('Setting main image URL to:', mainImgUrl);
                setMainImageUrl(mainImgUrl);
              }
              
              // Also process all images for the gallery (for later use)
              const processedImages = imgData.images.map(img => {
                // Fix URL path by ensuring lowercase /uploads/
                const fixedUrl = typeof img.url === 'string' ? 
                  img.url.replace(/^\/Uploads\//i, '/uploads/') : '';
                
                const imgUrl = fixedUrl.startsWith('http') 
                  ? fixedUrl 
                  : `http://localhost:5000${fixedUrl}`;
                
                return {
                  id: img.id,
                  url: imgUrl,
                  description: img.description || ''
                };
              });
              
              setImages(processedImages);
              console.log('Processed images for gallery:', processedImages);
            } else {
              // Set placeholder images if no images found
              setImages(createPlaceholders(propertyData, 4));
            }
          } else {
            console.log('Image fetch response not OK:', imgResponse.status);
            setImages(createPlaceholders(propertyData, 4));
          }
        } catch (imgError) {
          console.error('Error fetching property images:', imgError);
          setImages(createPlaceholders(propertyData, 4));
        }
        
        // Fetch similar properties (same district or type)
        try {
          const allPropertiesResponse = await fetch('http://localhost:5000/api/properties');
          const allProperties = await allPropertiesResponse.json();
          
          // Filter out the current property and get similar ones
          const similar = allProperties
            .filter(p => p && p["OFFER NO"] && p["OFFER NO"] !== id && (
              p["District"] === propertyData["District"] ||
              p["Type"] === propertyData["Type"]
            ))
            .slice(0, 6);
          
          // Fetch thumbnails for similar properties - SIMPLIFIED
          const similarWithImages = await Promise.all(
            similar.map(async (prop) => {
              try {
                // Same approach as property grid
                const imgResponse = await fetch(`http://localhost:5000/api/images/property/${prop["OFFER NO"]}`);
                if (imgResponse.ok) {
                  const imgData = await imgResponse.json();
                  if (imgData.images && imgData.images.length > 0) {
                    // Fix URL path by ensuring lowercase /uploads/
                    const fixedUrl = typeof imgData.images[0].url === 'string' ? 
                      imgData.images[0].url.replace(/^\/Uploads\//i, '/uploads/') : '';
                    
                    const imgUrl = fixedUrl.startsWith('http') 
                      ? fixedUrl 
                      : `http://localhost:5000${fixedUrl}`;
                    
                    return { ...prop, imageUrl: imgUrl };
                  }
                }
                return { ...prop, imageUrl: `https://source.unsplash.com/random/400x300?dubai,property,${prop["OFFER NO"]}` };
              } catch (err) {
                console.error(`Error fetching image for property ${prop["OFFER NO"]}:`, err);
                return { ...prop, imageUrl: `https://source.unsplash.com/random/400x300?dubai,property,${prop["OFFER NO"]}` };
              }
            })
          );
          
          // Make sure to filter out any invalid properties
          const validSimilarProperties = similarWithImages.filter(p => p && p["OFFER NO"]);
          setSimilarProperties(validSimilarProperties);
          
        } catch (similarError) {
          console.error('Error fetching similar properties:', similarError);
          setSimilarProperties([]);
        }
        
      } catch (error) {
        console.error('Error fetching property data:', error);
        setError(error.message || 'Failed to load property');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyData();
  }, [id]);

  // Open gallery with specific image
  const openGallery = (index = 0) => {
    setInitialSlide(index);
    setGalleryOpen(true);
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
  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <svg className="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The property you're looking for does not exist or has been removed."}</p>
          <Link href="/properties" className="bg-red-600 text-white px-6 py-3 rounded-md inline-block hover:bg-red-700 transition-colors">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  // Format property data
  const propertyPrice = property["TOTAL PRICE"] 
    ? `AED ${property["TOTAL PRICE"].toLocaleString()}`
    : 'Price on Request';
  
  const plotArea = property["Plot Area Sq. Ft."] 
    ? `${property["Plot Area Sq. Ft."].toLocaleString()} sqft (${property["Plot Area Sq M."]?.toLocaleString() || "-"} sqm)`
    : 'N/A';
  
  const gfaArea = property["GFA Sq. Ft."] 
    ? `${property["GFA Sq. Ft."].toLocaleString()} sqft (${property["GFA Sq M."]?.toLocaleString() || "-"} sqm)`
    : 'N/A';

  return (
    <div className="bg-white min-h-screen">
      <Head>
        <title>{property["Property Location"] || `Property ${id}`} | Planet Land Real Estate</title>
        <meta name="description" content={`${property["Property Location"]} - ${property["District"]} - ${propertyPrice}`} />
      </Head>
      
      {/* Fixed Header */}
      <Header />
      
      {/* Contact Sidebar */}
      <ContactSidebar />
      
      {/* Property Details */}
      <div className="pt-20 pb-20">
        {/* Back button */}
        <div className="container mx-auto px-4 mb-6">
          <Link href="/properties" className="inline-flex items-center text-gray-600 hover:text-red-600">
            <FaArrowLeft className="mr-2" />
            <span>Back to Properties</span>
          </Link>
        </div>
        
        {/* Hero section with property images */}
        <div ref={heroRef} className="container mx-auto px-4 mb-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Image - SIMPLIFIED APPROACH LIKE SIMILAR PROPERTIES */}
            <motion.div 
              className="md:w-2/3 relative rounded-xl overflow-hidden shadow-lg h-[400px] md:h-[500px]"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              {mainImageUrl ? (
                <img
                  src={mainImageUrl}
                  alt={property["Property Location"]}
                  className="w-full h-full object-cover"
                  onClick={() => openGallery(0)}
                  onError={(e) => {
                    console.error("Main image load error for URL:", mainImageUrl);
                    e.target.src = `https://source.unsplash.com/random/800x600?dubai,property,${property["OFFER NO"]}`;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center">
                  <FaImage className="text-gray-400 text-5xl mb-4" />
                  <span className="text-gray-500">No images available</span>
                </div>
              )}
              
              {images.length > 0 && (
                <motion.button
                  className="absolute bottom-4 right-4 bg-white text-gray-800 px-4 py-2 rounded-md flex items-center shadow-md"
                  onClick={() => openGallery(0)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaImage className="mr-2" />
                  <span>View All Images ({images.length})</span>
                </motion.button>
              )}
              
              <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md font-semibold">
                {property["Status"] || "FOR SALE"}
              </div>
            </motion.div>
            
            {/* Thumbnail grid */}
            <motion.div 
              className="md:w-1/3 grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 30 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {images.slice(1, 5).map((image, index) => (
                <motion.div
                  key={index}
                  className="relative rounded-xl overflow-hidden shadow-lg h-[180px] cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openGallery(index + 1)}
                >
                  <img
                    src={image.url || `https://source.unsplash.com/random/400x300?dubai,property,${index}`}
                    alt={image.description || `Property image ${index + 2}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Thumbnail error for ${image.url}`);
                      e.target.src = `https://source.unsplash.com/random/400x300?dubai,property,${index}`;
                    }}
                  />
                  
                  {/* Overlay for the last thumbnail showing +X more */}
                  {index === 3 && images.length > 5 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
                      <span className="text-xl font-bold">+{images.length - 5} more</span>
                    </div>
                  )}
                </motion.div>
              ))}
              
              {/* Fill empty slots with placeholder */}
              {Array.from({ length: Math.max(0, 4 - images.slice(1, 5).length) }).map((_, index) => (
                <div key={`placeholder-${index}`} className="bg-gray-200 rounded-xl h-[180px] flex items-center justify-center">
                  <FaImage className="text-gray-400 text-2xl" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Property details (left column) */}
            <div className="lg:w-2/3">
              {/* Property title and price */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {property["Property Location"] || "Untitled Property"}
                    </h1>
                    <p className="text-gray-600 text-lg">
                      {property["District"]}, {property["City__1"]}
                    </p>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    <div className="text-3xl md:text-4xl font-bold text-red-600">
                      {propertyPrice}
                    </div>
                    
                    {property["PRICE PER SQ FT PLOT"] && (
                      <p className="text-gray-600 text-sm">
                        {`AED ${property["PRICE PER SQ FT PLOT"].toLocaleString()} per sqft (plot)`}
                      </p>
                    )}
                    
                    {property["PRICE PER SQ FT GFA"] && (
                      <p className="text-gray-600 text-sm">
                        {`AED ${property["PRICE PER SQ FT GFA"].toLocaleString()} per sqft (GFA)`}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Offer number and sharing options */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <div className="text-gray-500">
                    Ref: <span className="font-medium">{property["OFFER NO"]}</span>
                    {property["DM Plot No."] && (
                      <span> | Plot No: <span className="font-medium">{property["DM Plot No."]}</span></span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaShareAlt />
                    </motion.button>
                    <motion.button
                      className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaDownload />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
              
              {/* Property highlights */}
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold mb-6">Property Highlights</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start space-x-4">
                    <div className="bg-red-100 p-3 rounded-full text-red-600">
                      <FaRuler />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Plot Area</h3>
                      <p className="text-gray-600">{plotArea}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start space-x-4">
                    <div className="bg-red-100 p-3 rounded-full text-red-600">
                      <FaBuilding />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">GFA</h3>
                      <p className="text-gray-600">{gfaArea}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start space-x-4">
                    <div className="bg-red-100 p-3 rounded-full text-red-600">
                      <FaMapMarkedAlt />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Type</h3>
                      <p className="text-gray-600">{property["Type"] || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start space-x-4">
                    <div className="bg-red-100 p-3 rounded-full text-red-600">
                      <FaCrown />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Freehold</h3>
                      <p className="text-gray-600">{property["Freehold"] || "No"}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Property specifications */}
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-6">Property Specifications</h2>
                
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500">Usage</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{property["Usage"] || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500">Proposed Height</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{property["Proposed Height Letters"] || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500">FAR (Floor Area Ratio)</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{property["FAR"] || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500">Type</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{property["Type"] || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500">Status</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {property["Status"] || "FOR SALE"}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap bg-gray-50 text-sm font-medium text-gray-500">Tags</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{property["Tags"] || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
              
              {/* Location section */}
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6">Location</h2>
                
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {property["Location Pin"] ? (
                    <div className="h-96 relative">
                      <iframe
                        src={`https://maps.google.com/maps?q=${property["Property Location"]}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight="0"
                        marginWidth="0"
                        title="Property Location"
                      ></iframe>
                      
                      <div className="absolute bottom-4 right-4 z-10">
                        <a
                          href={property["Location Pin"]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg shadow-md transition-colors flex items-center"
                        >
                          <FaMapMarkedAlt className="mr-2" />
                          <span>View on Google Maps</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="h-96 bg-gray-200 flex items-center justify-center">
                      <div className="text-center p-6">
                        <FaMapMarkedAlt className="text-gray-400 text-5xl mx-auto mb-4" />
                        <p className="text-gray-500">No location information available</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
              
              {/* Contact options */}
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-6">Contact Agent</h2>
                
                <div className="flex flex-wrap gap-4">
                  <motion.a
                    href="tel:+971563522988"
                    className="flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPhoneAlt className="mr-2" />
                    <span>Call Now</span>
                  </motion.a>
                  
                  <motion.a
                    href="https://wa.me/971563522988"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaWhatsapp className="mr-2" />
                    <span>WhatsApp</span>
                  </motion.a>
                  
                  <motion.a
                    href="mailto:info@planetland.net"
                    className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaEnvelope className="mr-2" />
                    <span>Email</span>
                  </motion.a>
                </div>
              </motion.div>
              
              {/* Similar properties section */}
              <SimilarProperties properties={similarProperties} />
            </div>
            
            {/* Inquiry form (right column) */}
            <div className="lg:w-1/3 mt-8 lg:mt-0">
              <div className="sticky top-24">
                <InquiryForm />
                
                {/* Quick property info summary */}
                <motion.div
                  className="mt-6 bg-gray-50 rounded-lg p-6 border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h3 className="text-lg font-semibold mb-4">Property Summary</h3>
                  
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Reference:</span>
                      <span className="font-medium">{property["OFFER NO"]}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{property["Type"] || "N/A"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium">{property["Status"] || "FOR SALE"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium text-red-600">{propertyPrice}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Plot Area:</span>
                      <span className="font-medium">{property["Plot Area Sq. Ft."]?.toLocaleString() || "N/A"} sqft</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">GFA:</span>
                      <span className="font-medium">{property["GFA Sq. Ft."]?.toLocaleString() || "N/A"} sqft</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{property["District"] || "N/A"}</span>
                    </li>
                  </ul>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      For more information about this property, please fill out the inquiry form or contact our team directly.
                    </p>
                  </div>
                </motion.div>
                
                {/* Download brochure CTA */}
                <motion.button
                  className="mt-6 w-full bg-gray-800 text-white p-4 rounded-lg flex items-center justify-center hover:bg-black transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaStickyNote className="mr-2" />
                  <span>Download Property Brochure</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Image gallery modal */}
      <AnimatePresence>
        {galleryOpen && (
          <ImageGallery
            images={images}
            isOpen={galleryOpen}
            onClose={() => setGalleryOpen(false)}
            initialSlide={initialSlide}
          />
        )}
      </AnimatePresence>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}