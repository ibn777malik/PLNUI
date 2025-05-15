import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CountUp = ({ end, duration = 2, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (!isInView) return;
    
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);
  
  return (
    <span ref={nodeRef}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const StatsSection = () => {
  const stats = [
    {
      value: 2.5,
      suffix: 'B+',
      title: 'Property Portfolio',
      description: 'AED value of exclusive properties'
    },
    {
      value: 98,
      suffix: '%',
      title: 'Success Rate',
      description: 'Meeting client requirements'
    },
    {
      value: 175,
      suffix: '+',
      title: 'Prime Locations',
      description: 'Premium Dubai properties'
    },
    {
      value: 12,
      suffix: '+',
      title: 'Years Experience',
      description: 'In Dubai real estate market'
    }
  ];
  
  return (
    <section className="py-20 bg-black text-white relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-20" 
        style={{
          backgroundImage: 'url(https://source.unsplash.com/random/1920x1080?dubai,skyline,night)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      <motion.div 
        className="absolute top-0 left-0 w-full h-2 bg-red-600"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-2">Our <span className="text-red-600">Impact</span> in Numbers</h2>
          <div className="w-20 h-1 bg-red-600 mx-auto"></div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-black bg-opacity-70 border border-gray-800 rounded-lg p-8 text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 0 20px rgba(220, 38, 38, 0.3)",
                borderColor: "#dc2626"
              }}
            >
              <div className="text-5xl font-bold mb-4 text-red-600">
                <CountUp 
                  end={stat.value} 
                  suffix={stat.suffix}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{stat.title}</h3>
              <p className="text-gray-400">{stat.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Planet Land has established itself as a leader in Dubai's premium real estate market,
            providing exceptional service and unparalleled property opportunities.
          </p>
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute bottom-0 right-0 w-full h-2 bg-red-600"
        initial={{ scaleX: 0, originX: 1 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true }}
      />
    </section>
  );
};

export default StatsSection;