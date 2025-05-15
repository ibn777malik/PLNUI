// frontend/pages/dashboard/index.jsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const tabs = ["Properties", "Settings"];

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Properties");
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    if (activeTab === "Properties") {
      fetch('http://localhost:5000/api/properties')
        .then(res => res.json())
        .then(data => setProperties(data));
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Dashboard</h2>
          {tabs.map(tab => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer p-2 rounded mb-2 ${activeTab === tab ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              {tab}
            </div>
          ))}
        </div>
        <div className="mt-6">
          <button
            onClick={() => router.push('/')}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded mb-2"
          >
            Visit Website
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-grow p-6">
        {activeTab === "Properties" && (
          <>
            <h3 className="text-2xl font-bold mb-4">All Properties</h3>
            <table className="w-full table-auto border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">OFFER NO</th>
                  <th className="border p-2 text-left">Property Location</th>
                  <th className="border p-2 text-left">District</th>
                  <th className="border p-2 text-left">City</th>
                  <th className="border p-2 text-left">Price (AED)</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(p => (
                  <tr key={p["OFFER NO"]}>
                    <td className="border p-2">{p["OFFER NO"]}</td>
                    <td className="border p-2">{p["Property Location"]}</td>
                    <td className="border p-2">{p["District"]}</td>
                    <td className="border p-2">{p["City__1"]}</td>
                    <td className="border p-2">{p["TOTAL PRICE"].toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {activeTab === "Settings" && (
          <>
            <h3 className="text-2xl font-bold mb-4">Settings</h3>
            <p>Settings panel can go here: profile, password change, etc.</p>
          </>
        )}
      </main>
    </div>
  );
}
