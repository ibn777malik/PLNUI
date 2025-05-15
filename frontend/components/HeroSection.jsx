import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';

// AnimatedText component for staggered word reveal
const AnimatedText = ({ text, delay = 0, className = "" }) => {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay * i },
    }),
  };
  
  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };
  
  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-1"
          variants={child}
        >
          {word}{" "}
        </motion.span>
      ))}
    </motion.span>
  );
};

// AnimatedButton component with hover effects
const AnimatedButton = ({ primary = true, children, className = "", ...props }) => {
  const baseClasses = "relative overflow-hidden font-semibold rounded-md text-center inline-flex items-center justify-center transition-transform";
  const buttonColor = primary 
    ? "bg-red-600 hover:bg-red-700 text-white" 
    : "border-2 border-white text-white hover:bg-white hover:text-black";
  
  return (
    <motion.button
      className={`${baseClasses} ${buttonColor} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <span className="relative z-10 px-6 py-3">{children}</span>
      {!primary && (
        <motion.span 
          className="absolute inset-0 bg-white transform origin-left z-0"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      {primary && (
        <motion.span 
          className="absolute inset-0 bg-black transform origin-left z-0"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};

// Hero Section Component
const HeroSection = () => {
  // State for background image slider
  const [properties, setProperties] = useState([
    { "Property Location": "Business Bay", "District": "Dubai" },
    { "Property Location": "Downtown Dubai", "District": "Dubai" },
    { "Property Location": "Dubai Marina", "District": "Dubai" },
    { "Property Location": "Palm Jumeirah", "District": "Dubai" },
    { "Property Location": "DIFC", "District": "Dubai" },
  ]);
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Reference for scroll-based animations
  const heroRef = useRef(null);
  
  // Auto rotate background images
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSlide((prevSlide) => 
        prevSlide === (properties.length - 1) ? 0 : prevSlide + 1
      );
    }, 6000);
    return () => clearTimeout(timer);
  }, [activeSlide, properties.length]);
  
  // Scroll-based animations
  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.1]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.5]);
  const titleY = useTransform(scrollY, [0, 300], [0, -50]);
  
  return (
    <section 
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Animated background slider */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ scale: heroScale, opacity: heroOpacity }}
      >
        <AnimatePresence mode="wait">
          {properties.length > 0 && (
            <motion.div 
              key={activeSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
              style={{
                backgroundImage: `url(https://source.unsplash.com/random/1920x1080?dubai,luxury,property,${properties[activeSlide]["Property Location"]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.5 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Animated overlay patterns */}
        <div className="absolute inset-0 z-0 opacity-10">
          <motion.div 
            className="absolute top-0 left-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.3),transparent_70%)]" />
          </motion.div>
        </div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 z-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.5, 0.1],
              }}
              transition={{
                repeat: Infinity,
                duration: 3 + Math.random() * 5,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="container mx-auto px-4 z-10 mt-20">
        <motion.div 
          className="max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ y: titleY }}
        >
          <div className="overflow-hidden mb-4">
            <AnimatedText 
              text="Discover Excellence in" 
              className="text-4xl md:text-6xl font-bold text-white"
            />
          </div>
          <div className="overflow-hidden mb-6">
            <AnimatedText 
              text="Dubai Real Estate" 
              className="text-4xl md:text-6xl font-bold text-red-600"
              delay={0.2}
            />
          </div>
          
          <motion.p 
            className="text-xl text-white mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Exclusive high-value properties and development opportunities
            in Dubai's most prestigious locations.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <AnimatedButton primary className="px-8 py-4 text-lg">
              <span className="flex items-center">
                <span>Explore Properties</span>
                <motion.svg
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </motion.svg>
              </span>
            </AnimatedButton>
            
            <AnimatedButton primary={false} className="px-8 py-4 text-lg">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Contact Us</span>
              </span>
            </AnimatedButton>
          </motion.div>
          
          {/* Animated stats teaser */}
          <motion.div
            className="mt-12 flex flex-wrap gap-8 justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            {[
              { label: "Properties", value: "175+" },
              { label: "Client Satisfaction", value: "98%" },
              { label: "Years of Experience", value: "12+" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="flex flex-col"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.8 + index * 0.2 }}
              >
                <motion.span 
                  className="text-3xl font-bold text-red-600"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 3,
                    delay: index * 0.5
                  }}
                >
                  {stat.value}
                </motion.span>
                <span className="text-white text-sm">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          className="w-8 h-12 border-2 border-white rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <motion.div
            className="w-1.5 h-1.5 bg-white rounded-full mt-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </motion.div>
      </motion.div>
      
      {/* Slide indicators */}
      <motion.div 
        className="absolute bottom-10 left-0 right-0 flex justify-center space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {properties.map((_, index) => (
          <motion.button 
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`relative w-10 h-2 rounded-full overflow-hidden ${activeSlide === index ? 'bg-red-600' : 'bg-white bg-opacity-30'} transition-colors`}
            whileHover={{ scale: 1.1 }}
          >
            {activeSlide === index && (
              <motion.div 
                className="absolute inset-0 bg-red-600"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 6, ease: "linear" }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>
      
      {/* Animated corner decorations */}
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-red-600 opacity-60"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-red-600 opacity-60"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      />
      
      {/* Dynamic 3D tilt effect on mouse move */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ perspective: 1000 }}
        animate={{ 
          rotateX: scrollY.get() > 100 ? 0 : 0,
          rotateY: scrollY.get() > 100 ? 0 : 0
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
    </section>
  );
};

export default HeroSection;