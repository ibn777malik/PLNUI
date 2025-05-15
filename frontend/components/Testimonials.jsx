// frontend/components/Testimonials.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: "Mohammed Al Mansoori",
    position: "Property Developer",
    image: "https://source.unsplash.com/random/100x100?portrait=1",
    quote: "Planet Land helped me find the perfect plot in Business Bay for our latest development. Their market knowledge and professional approach are unmatched in Dubai."
  },
  {
    id: 2,
    name: "Sarah Johnson",
    position: "International Investor",
    image: "https://source.unsplash.com/random/100x100?portrait=2",
    quote: "As an overseas investor, I needed a team I could trust. Planet Land's attention to detail and comprehensive market analysis gave me the confidence to make a significant investment in Dubai's property market."
  },
  {
    id: 3,
    name: "Abdullah Al Qasimi",
    position: "Real Estate Fund Manager",
    image: "https://source.unsplash.com/random/100x100?portrait=3",
    quote: "We've partnered with Planet Land on multiple high-value acquisitions. Their deep understanding of Dubai's premium property market consistently delivers exceptional investment opportunities."
  },
  {
    id: 4,
    name: "Elena Petrov",
    position: "Luxury Hotel Developer",
    image: "https://source.unsplash.com/random/100x100?portrait=4",
    quote: "Finding the right location is critical in the hospitality industry. Planet Land's expertise helped us secure a prime plot that exceeded our expectations and has become our flagship property."
  }
];

const slideVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.6 } }
};

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setCurrent((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(iv);
  }, []);

  const next = () => setCurrent((i) => (i + 1) % testimonials.length);
  const prev = () => setCurrent((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-16 bg-black text-white">
      <motion.h2
        className="text-4xl font-extrabold text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        What Our <span className="text-red-600">Clients</span> Say
      </motion.h2>

      <div className="relative max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={testimonials[current].id}
            className="bg-white text-black rounded-2xl p-10 shadow-2xl flex items-center gap-6"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.img
              src={testimonials[current].image}
              alt={testimonials[current].name}
              className="w-24 h-24 rounded-full border-4 border-red-600"
              whileHover={{ scale: 1.2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />

            <div>
              <p className="italic text-lg mb-4">
                “{testimonials[current].quote}”
              </p>
              <p className="font-bold text-xl">{testimonials[current].name}</p>
              <p className="text-red-600 uppercase text-sm">{testimonials[current].position}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center mt-6 space-x-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-4 h-4 rounded-full transition-colors ${
                i === current ? 'bg-red-600 scale-125' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={prev}
          className="absolute top-1/2 left-0 p-3 bg-red-600 rounded-full -translate-y-1/2 hover:scale-110 transition"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute top-1/2 right-0 p-3 bg-red-600 rounded-full -translate-y-1/2 hover:scale-110 transition"
        >
          ›
        </button>
      </div>
    </section>
  );
};

export default Testimonials;
