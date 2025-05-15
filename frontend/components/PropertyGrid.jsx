import React, { useEffect, useState } from 'react';
import PropertyCard from './PropertyCard';

const PropertyGrid = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/properties')
      .then(res => res.json())
      .then(data => setProperties(data));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {properties.map((p) => (
        <PropertyCard key={p["OFFER NO"]} property={p} />
      ))}
    </div>
  );
};

export default PropertyGrid;
