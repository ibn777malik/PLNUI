import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSlide((prevSlide) => 
        prevSlide === (properties.length - 1) ? 0 : prevSlide + 1
      );
    }, 5000);
    return () => clearTimeout(timer);
  }, [activeSlide, properties.length]);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } }
  };

  const slideIn = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  const scaleUp = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <motion.header 
        className="bg-black text-white p-4 fixed w-full z-10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 mr-2 bg-red-600 rounded-full flex items-center justify-center"
            >
              <span className="text-white font-bold">PL</span>
            </motion.div>
            <motion.h1 
              className="text-2xl font-bold"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Planet Land
            </motion.h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <motion.li 
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link href="/" className="hover:text-red-500 transition-colors">Home</Link>
              </motion.li>
              <motion.li 
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/properties" className="hover:text-red-500 transition-colors">Properties</Link>
              </motion.li>
              <motion.li 
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link href="/about" className="hover:text-red-500 transition-colors">About</Link>
              </motion.li>
              <motion.li 
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link href="/contact" className="hover:text-red-500 transition-colors">Contact</Link>
              </motion.li>
            </ul>
          </nav>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
          >
            <Link href="/login">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold transition-colors">
                Login
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="relative h-screen bg-black flex items-center justify-center overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {properties.length > 0 && (
          <div className="absolute inset-0 z-0">
            {properties.map((property, index) => (
              <div 
                key={property["OFFER NO"]} 
                className={`absolute inset-0 transition-opacity duration-1000 ${index === activeSlide ? 'opacity-40' : 'opacity-0'}`}
                style={{
                  backgroundImage: `url(https://source.unsplash.com/random/1920x1080?dubai,property,${property["Property Location"]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            ))}
          </div>
        )}
        
        <div className="container mx-auto px-4 z-10 mt-16">
          <div className="max-w-3xl">
            <motion.h2 
              className="text-5xl md:text-6xl font-bold text-white mb-4"
              variants={slideIn}
            >
              Premier Properties in <span className="text-red-600">Dubai</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-white mb-8"
              variants={slideIn}
              transition={{ delay: 0.2 }}
            >
              Discover exclusive high-value real estate opportunities with Planet Land
            </motion.p>
            <motion.div
              className="flex space-x-4"
              variants={slideIn}
              transition={{ delay: 0.4 }}
            >
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold text-lg transition-colors">
                Explore Properties
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-md font-semibold text-lg transition-colors">
                Contact Us
              </button>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="absolute bottom-10 left-0 right-0 flex justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {properties.slice(0, 5).map((_, index) => (
            <button 
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-3 h-3 rounded-full ${activeSlide === index ? 'bg-red-600' : 'bg-white bg-opacity-50'} transition-colors`}
            />
          ))}
        </motion.div>
      </motion.section>

      {/* Featured Properties */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-2">Featured <span className="text-red-600">Properties</span></h2>
            <div className="w-20 h-1 bg-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Explore our handpicked selection of exclusive properties in the most prestigious areas of Dubai
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.slice(0, 3).map((property, index) => (
                <motion.div 
                  key={property["OFFER NO"]}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={`https://source.unsplash.com/random/600x400?dubai,building,${property["Property Location"]}`} 
                      alt={property["Property Location"]} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-red-600 text-white py-1 px-3 rounded-md font-semibold">
                      {property["Status"]}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{property["Property Location"] || "Untitled Plot"}</h3>
                    <p className="text-gray-600 mb-2">{property["District"]} - {property["City__1"]}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm">
                       {property["Plot Area Sq. Ft."] 
  ? property["Plot Area Sq. Ft."].toLocaleString() + " sqft" 
  : "N/A"}
                      </span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm">
                        {property["Usage"]}
                      </span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm">
                        {property["Proposed Height Letters"]}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-lg text-red-600">
                        AED {property["TOTAL PRICE"].toLocaleString()}
                      </p>
                      <Link href={`/properties/${property["OFFER NO"]}`}>
                        <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md transition-colors">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link href="/properties">
              <button className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-3 rounded-md font-semibold transition-colors">
                View All Properties
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-2">Why Choose <span className="text-red-600">Planet Land</span></h2>
            <div className="w-20 h-1 bg-red-600 mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🏢",
                title: "Premium Locations",
                description: "Access to exclusive properties in Dubai's most prestigious neighborhoods"
              },
              {
                icon: "💰",
                title: "Investment Expertise",
                description: "Professional guidance on high-value real estate investments with maximum ROI"
              },
              {
                icon: "🤝",
                title: "Personalized Service",
                description: "Tailored approach to meet your specific real estate needs and preferences"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-lg shadow-md text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-black text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div 
          className="absolute inset-0 z-0 opacity-20" 
          style={{
            backgroundImage: 'url(https://source.unsplash.com/random/1920x1080?dubai,skyline)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-4xl font-bold mb-4"
              variants={scaleUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Ready to Find Your Perfect Property?
            </motion.h2>
            <motion.p 
              className="text-xl mb-8"
              variants={scaleUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Let us help you discover the most exclusive real estate opportunities in Dubai
            </motion.p>
            <motion.div
              variants={scaleUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold text-lg transition-colors mx-2">
                Contact an Agent
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-md font-semibold text-lg transition-colors mx-2 mt-4 md:mt-0">
                Browse Properties
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-black text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Planet Land</h3>
              <p className="text-gray-400 mb-4">
                Your gateway to premium real estate opportunities in Dubai's most prestigious locations.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-red-500 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-red-500 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-red-500 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Properties</a></li>
                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Property Types</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Development Plots</a></li>
                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Commercial Properties</a></li>
                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Residential Towers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors">Mixed-Use Developments</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mt-0.5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>Business Bay, Dubai, UAE</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mt-0.5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span>+971 50 123 4567</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mt-0.5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>info@planetland.com</span>
                </li>
              </ul>
            </div>
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