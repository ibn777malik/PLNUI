// frontend/components/ContactSidebar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const buttons = [
  {
    label: 'Call',
    href: 'tel:+971563522988',
    icon: <FaPhoneAlt size={20} />,
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/971563522988',
    icon: <FaWhatsapp size={20} />,
  },
  {
    label: 'Email',
    href: 'mailto:info@planetland.net',
    icon: <FaEnvelope size={20} />,
  },
];

const ContactSidebar = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const buttonVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: i => ({
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 20, delay: i * 0.1 },
    }),
    hover: {
      scale: 1.2,
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
      backgroundColor: '#e63946',
      color: '#fff',
    },
  };

  return (
    <motion.div
      className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {buttons.map((btn, index) => (
        <motion.a
          key={btn.label}
          href={btn.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={btn.label}
          className="w-14 h-14 bg-white text-red-600 rounded-full shadow-2xl flex items-center justify-center"
          custom={index}
          variants={buttonVariants}
          whileHover="hover"
        >
          {btn.icon}
        </motion.a>
      ))}
    </motion.div>
  );
};

export default ContactSidebar;
