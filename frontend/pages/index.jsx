import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

// Import components
import StatsSection from '../components/StatsSection';
import Testimonials from '../components/Testimonials';
import PropertyCard from '../components/PropertyCard';
import ContactSidebar from '../components/ContactSidebar';
import FeaturedPropertiesSection from '../components/FeaturedPropertiesSection';
import PremiumOpportunitiesSection from '../components/PremiumOpportunitiesSection';

const HomePage = () => {
  // State management
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Scroll animation setup
  const { scrollY, scrollYProgress } = useScroll();
  const headerBackgroundOpacity = useTransform(scrollY, [0, 100], [0.8, 0.95]);
  const headerShadow = useTransform(scrollY, [0, 100], ["0 0 0 rgba(0,0,0,0)", "0 10px 20px rgba(0,0,0,0.1)"]);
  const progressBarScaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Refs
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef);

  // Fetch properties data
  useEffect(() => {
    fetch('http://localhost:5000/api/properties')
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching properties:', err);
        setIsLoading(false);
      });
  }, []);

  // Hero slider animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSlide((prevSlide) => 
        prevSlide === (properties.length - 1) ? 0 : prevSlide + 1
      );
    }, 6000);
    return () => clearTimeout(timer);
  }, [activeSlide, properties.length]);

  // Animation variants
  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

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
  
  // 3D Rotating Card Component
  const RotatingCard = ({ frontContent, backContent }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    
    return (
      <motion.div 
        className="relative w-full h-full perspective-1000 cursor-pointer"
        whileHover={{ scale: 1.03 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="relative w-full h-full transition-all duration-500 preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden">
            {frontContent}
          </div>
          
          {/* Back */}
          <div 
            className="absolute w-full h-full backface-hidden"
            style={{ transform: 'rotateY(180deg)' }}
          >
            {backContent}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Interactive Property Slider
  const PropertySlider = ({ properties }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const goToNext = () => {
      setCurrentIndex((prev) => (prev === properties.length - 1 ? 0 : prev + 1));
    };
    
    const goToPrev = () => {
      setCurrentIndex((prev) => (prev === 0 ? properties.length - 1 : prev - 1));
    };
    
    // Auto rotate
    useEffect(() => {
      const interval = setInterval(goToNext, 5000);
      return () => clearInterval(interval);
    }, []);
    
    const variants = {
      enter: (direction) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      }),
      center: {
        x: 0,
        opacity: 1,
      },
      exit: (direction) => ({
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      }),
    };
    
    return (
      <div className="relative w-full h-[600px] overflow-hidden rounded-xl">
        <AnimatePresence initial={false} custom={currentIndex}>
          <motion.div
            key={currentIndex}
            custom={currentIndex}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0"
          >
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ 
                backgroundImage: `url(https://source.unsplash.com/random/1200x800?dubai,property,${properties[currentIndex]["Property Location"]})`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                    {properties[currentIndex]["Status"]}
                  </span>
                  <h3 className="text-3xl font-bold mt-3 mb-2">
                    {properties[currentIndex]["Property Location"] || "Untitled Property"}
                  </h3>
                  <p className="text-lg opacity-90 mb-4">
                    {properties[currentIndex]["District"]} - {properties[currentIndex]["City__1"]}
                  </p>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-sm opacity-75">Price</p>
                      <p className="text-xl font-bold">
                        AED {properties[currentIndex]["TOTAL PRICE"].toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm opacity-75">Area</p>
                      <p className="text-xl font-bold">
                        {properties[currentIndex]["Plot Area Sq. Ft."].toLocaleString()} sqft
                      </p>
                    </div>
                    <div>
                      <p className="text-sm opacity-75">Usage</p>
                      <p className="text-xl font-bold">
                        {properties[currentIndex]["Usage"]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link href={`/properties/${properties[currentIndex]["OFFER NO"]}`}>
                      <motion.button
                        className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>View Property</span>
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation buttons */}
        <button 
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 w-12 h-12 rounded-full flex items-center justify-center text-white backdrop-blur-sm z-10"
          onClick={goToPrev}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 w-12 h-12 rounded-full flex items-center justify-center text-white backdrop-blur-sm z-10"
          onClick={goToNext}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Indicators */}
        <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2 z-10">
          {properties.slice(0, 5).map((_, i) => (
            <button
              key={i}
              className={`w-12 h-1 rounded-full transition-all ${i === currentIndex ? 'bg-red-600 w-20' : 'bg-white bg-opacity-50'}`}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      </div>
    );
  };

  const navItemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-red-600 z-50 origin-left"
        style={{ scaleX: progressBarScaleX }}
      />
      
      {/* Header */}
      <motion.header 
        className="bg-black text-white py-4 px-6 fixed w-full z-40 transition-all duration-300"
        style={{
          boxShadow: headerShadow,
          backgroundColor: `rgba(0,0,0,${headerBackgroundOpacity})`
        }}
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.8 
              }}
              className="w-12 h-12 mr-3 bg-red-600 rounded-full flex items-center justify-center"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-white font-bold text-lg"
              >
                PL
              </motion.span>
            </motion.div>
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold">
                <span className="text-white">Planet</span>
                <span className="text-red-600">Land</span>
              </h1>
              <motion.div
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="h-0.5 bg-red-600 w-full mt-1"
              />
            </motion.div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:block">
            <motion.ul 
              className="flex space-x-8"
              variants={navVariants}
              initial="hidden"
              animate="visible"
            >
              {['Home', 'Properties', 'About', 'Get in Touch'].map((item, i) => (
                <motion.li 
                  key={item}
                  variants={navItemVariants}
                  custom={i}
                  whileHover={{ scale: 1.1 }}
                >
                  <Link href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                    className="relative group text-white transition-colors">
                    <span>{item}</span>
                    <motion.span 
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 origin-left transform"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </nav>
          
          {/* Login button */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
          >
            <Link href="/login">
              <motion.button
                className="relative overflow-hidden group bg-red-600 text-white px-5 py-2 rounded-md font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Login</span>
                <motion.span 
                  className="absolute inset-0 bg-black transform origin-right"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>
          </motion.div>
          
          {/* Mobile menu button */}
          <motion.div
            className="block md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <button className="text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </motion.div>
        </div>
      </motion.header>

      {/* ContactSidebar */}
      <ContactSidebar />

      {/* Main Content Sections */}
      {/* 1. Hero Section */}
      <section 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
      >
        {/* Animated background slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            {properties.length > 0 && (
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
              >
                {/* Video element for background */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  src={
                    properties[activeSlide]?.videoUrl ||
                    'https://raw.githubusercontent.com/AbdallaMalik/PlanetLand/master/PlanetLandHero.mp4'
                  }
                />
                {/* Gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 0.5 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlapping animated patterns */}
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
        </div>

        <div className="container mx-auto px-4 z-10 mt-20">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
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
                Contact Us
              </AnimatedButton>
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
          {properties.slice(0, 5).map((_, index) => (
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
      </section>

      {/* 2. Featured Properties Section */}
      <FeaturedPropertiesSection properties={properties} />

      {/* 3. Premium Opportunities Section */}
  <PremiumOpportunitiesSection properties={properties} />

      {/* 4. Stats Section */}
      <StatsSection />

      {/* 5. Why Choose Us Section */}
      <section className="py-20 bg-white overflow-hidden relative">
        <motion.div 
          className="absolute top-0 right-0 w-72 h-72 bg-red-100 rounded-full opacity-20 -z-10"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -50, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 left-10 w-64 h-64 bg-gray-200 rounded-full opacity-30 -z-10"
          animate={{ 
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20,
            ease: "easeInOut"
          }}
        />

        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-2 relative z-10">
                <span className="text-black">Why Choose </span>
                <span className="text-red-600">Planet Land</span>
              </h2>
              <motion.div 
                className="absolute -bottom-3 left-0 right-0 h-3 bg-gray-100 z-0"
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
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                title: "Premium Locations",
                description: "Access to exclusive properties in Dubai's most prestigious neighborhoods",
                icon: "🌍",
                stats: "175+ Prime Properties",
                bgColor: "from-red-500 to-red-700"
              },
              {
                title: "Investment Expertise",
                description: "Professional guidance on high-value real estate investments with maximum ROI",
                icon: "📈",
                stats: "AED 2.5B+ Portfolio Value",
                bgColor: "from-black to-gray-800"
              },
              {
                title: "Personalized Service",
                description: "Tailored approach to meet your specific real estate needs and preferences",
                icon: "🤝",
                stats: "98% Client Satisfaction",
                bgColor: "from-red-600 to-red-800"
              }
            ].map((feature, index) => (
              <div key={index} className="h-80 perspective-1000">
                <RotatingCard 
                  frontContent={
                    <motion.div 
                      className="h-full bg-white p-8 rounded-xl shadow-xl flex flex-col items-center justify-center text-center"
                      whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                    >
                      <motion.div 
                        className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-4xl mb-6"
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 5
                        }}
                      >
                        {feature.icon}
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                      <div className="mt-4 text-red-600 font-medium">Click to see more</div>
                    </motion.div>
                  }
                  backContent={
                    <motion.div 
                      className={`h-full bg-gradient-to-br ${feature.bgColor} p-8 rounded-xl shadow-xl flex flex-col items-center justify-center text-center text-white`}
                    >
                      <h3 className="text-2xl font-bold mb-6">{feature.title}</h3>
                      <div className="text-4xl font-bold mb-4">{feature.stats}</div>
                      <p className="mb-6">Our team of experts is ready to help you find the perfect property investment.</p>
                      <motion.button
                        className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Learn More
                      </motion.button>
                    </motion.div>
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <Testimonials />

      {/* 7. Map Section */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-2">
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

            <div className="relative w-full h-full z-10">
              {[
                { id: 1, name: "Business Bay", x: "30%", y: "45%" },
                { id: 2, name: "Downtown Dubai", x: "35%", y: "35%" },
                { id: 3, name: "Dubai Marina", x: "15%", y: "65%" },
                { id: 4, name: "Palm Jumeirah", x: "20%", y: "55%" },
                { id: 5, name: "DIFC", x: "40%", y: "40%" }
              ].map((location) => (
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
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-2 h-2 bg-red-600 rotate-45" />
                    </div>
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
            
            <div className="absolute bottom-6 right-6 z-20">
              <motion.div 
                className="bg-white bg-opacity-90 rounded-lg p-3 shadow-lg text-sm"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
              >
                <p className="font-semibold mb-2">Our Premium Locations</p>
                <ul className="space-y-1">
                  {["Business Bay", "Downtown Dubai", "Dubai Marina", "Palm Jumeirah", "DIFC"].map((location, i) => (
                    <motion.li 
                      key={location}
                      className="flex items-center"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-2" />
                      {location}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call-to-Action Section */}
      <section className="py-20 bg-black text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-20" 
          style={{
            backgroundImage: 'url(https://source.unsplash.com/random/1920x1080?dubai,skyline,night)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-red-600"
          initial={{ scaleX: 0, transformOrigin: "left" }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-full h-1 bg-red-600"
          initial={{ scaleX: 0, transformOrigin: "right" }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="text-center perspective-1000"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ rotateX: -30, opacity: 0 }}
                whileInView={{ rotateX: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Find Your <span className="text-red-600">Perfect Property</span>?
                </h2>
              </motion.div>
              
              <motion.p 
                className="text-xl mb-10"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Let us help you discover the most exclusive real estate opportunities in Dubai
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-5 justify-center"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <AnimatedButton primary className="px-8 py-4 text-lg">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Find Your Property
                  </span>
                </AnimatedButton>
                
                <AnimatedButton primary={false} className="px-8 py-4 text-lg">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Us
                  </span>
                </AnimatedButton>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Footer content will go here */}
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-400">© 2025 Planet Land Real Estate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;