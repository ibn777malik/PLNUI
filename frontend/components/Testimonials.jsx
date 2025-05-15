import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: "Mohammed Al Mansoori",
      position: "Property Developer",
      image: "https://source.unsplash.com/random/100x100?portrait=1",
      quote: "Planet Land helped me find the perfect plot in Business Bay for our latest development. Their market knowledge and professional approach are unmatched in Dubai.",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "International Investor",
      image: "https://source.unsplash.com/random/100x100?portrait=2",
      quote: "As an overseas investor, I needed a team I could trust. Planet Land's attention to detail and comprehensive market analysis gave me the confidence to make a significant investment in Dubai's property market.",
    },
    {
      id: 3,
      name: "Abdullah Al Qasimi",
      position: "Real Estate Fund Manager",
      image: "https://source.unsplash.com/random/100x100?portrait=3",
      quote: "We've partnered with Planet Land on multiple high-value acquisitions. Their deep understanding of Dubai's premium property market consistently delivers exceptional investment opportunities.",
    },
    {
      id: 4,
      name: "Elena Petrov",
      position: "Luxury Hotel Developer",
      image: "https://source.unsplash.com/random/100x100?portrait=4",
      quote: "Finding the right location is critical in the hospitality industry. Planet Land's expertise helped us secure a prime plot that exceeded our expectations and has become our flagship property.",
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-2">Client <span className="text-red-600">Testimonials</span></h2>
          <div className="w-20 h-1 bg-red-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Hear what our satisfied clients have to say about their experience with Planet Land
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 w-12 h-12 text-6xl text-red-600 opacity-30">"</div>
          <div className="absolute -bottom-6 -right-6 w-12 h-12 text-6xl text-red-600 opacity-30 rotate-180">"</div>
          
          <div className="bg-gray-50 rounded-xl p-8 md:p-12 shadow-lg relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row items-center md:items-start gap-6"
              >
                <motion.div 
                  className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-4 border-red-600"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="flex-1">
                  <blockquote className="text-lg md:text-xl italic text-gray-700 mb-4">
                    {testimonials[currentIndex].quote}
                  </blockquote>
                  <div className="flex flex-col">
                    <cite className="text-xl font-bold text-black not-italic">
                      {testimonials[currentIndex].name}
                    </cite>
                    <span className="text-gray-600">
                      {testimonials[currentIndex].position}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <button 
              onClick={prevTestimonial}
              className="absolute top-1/2 -left-4 md:-left-6 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Previous testimonial"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextTestimonial}
              className="absolute top-1/2 -right-4 md:-right-6 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Next testimonial"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;