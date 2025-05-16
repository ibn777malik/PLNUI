// frontend/pages/dashboard/index.jsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyTab from '../../components/dashboard/PropertyTab';
import { FaHome, FaCog, FaChartBar, FaUsers, FaSignOutAlt, FaGlobe, FaSearch, FaBars } from 'react-icons/fa';

const tabs = [
  { id: "properties", label: "Properties", icon: <FaHome size={16} /> },
  { id: "analytics", label: "Analytics", icon: <FaChartBar size={16} /> },
  { id: "users", label: "Users", icon: <FaUsers size={16} /> },
  { id: "settings", label: "Settings", icon: <FaCog size={16} /> }
];

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("properties");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <motion.div 
          className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.aside 
        className={`bg-gray-900 text-white transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Logo or App name */}
          <div className="mb-8 flex items-center">
            {isSidebarCollapsed ? (
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">PL</span>
              </div>
            ) : (
              <div>
                <h1 className="text-xl font-bold flex items-center">
                  <span className="text-white">Planet</span>
                  <span className="text-red-600">Land</span>
                </h1>
                <div className="h-1 w-12 bg-red-600 mt-1"></div>
                <p className="text-gray-400 text-sm mt-1">Admin Dashboard</p>
              </div>
            )}
            
            <button 
              className="ml-auto text-gray-400 hover:text-white"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              <FaBars size={16} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-1">
              {tabs.map(tab => (
                <motion.li key={tab.id} whileHover={{ x: 5 }}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {!isSidebarCollapsed && (
                      <span className={activeTab === tab.id ? 'font-semibold' : ''}>{tab.label}</span>
                    )}
                    {(activeTab === tab.id && !isSidebarCollapsed) && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="w-1 h-4 ml-auto bg-white rounded-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Footer buttons */}
          <div className="mt-auto pt-6 space-y-2">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 p-2 rounded flex items-center justify-center space-x-2"
            >
              <FaGlobe size={16} />
              {!isSidebarCollapsed && <span>Visit Website</span>}
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded flex items-center justify-center space-x-2"
            >
              <FaSignOutAlt size={16} />
              {!isSidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Header */}
        <motion.header 
          className="bg-white border-b border-gray-200 p-4 flex justify-between items-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 pl-10 border border-gray-300 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            <div className="relative group">
              <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                <span className="font-semibold">A</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <button onClick={() => router.push('/profile')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Your Profile
                </button>
                <button onClick={() => router.push('/settings')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </button>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Tab content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "properties" && <PropertyTab />}
              {activeTab === "settings" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-2xl font-bold mb-4">Settings</h3>
                  <p className="text-gray-600">
                    Configure your application settings here. This tab is currently under development.
                  </p>
                </div>
              )}
              {activeTab === "analytics" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-2xl font-bold mb-4">Analytics</h3>
                  <p className="text-gray-600">
                    View analytics and reports. This tab is currently under development.
                  </p>
                </div>
              )}
              {activeTab === "users" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-2xl font-bold mb-4">Users Management</h3>
                  <p className="text-gray-600">
                    Manage users and permissions. This tab is currently under development.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}