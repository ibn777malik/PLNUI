// frontend/pages/properties/[id].jsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function PropertyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/properties/${id}`)
        .then(res => res.json())
        .then(data => setProperty(data));
    }
  }, [id]);

  if (!property) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">
        {property["Property Location"] || "Untitled Plot"}
      </h1>
      <p><strong>District:</strong> {property["District"]}</p>
      <p><strong>City:</strong> {property["City__1"]}</p>
      <p><strong>Status:</strong> {property["Status"]}</p>
      <p><strong>Plot Area:</strong> {property["Plot Area Sq. Ft."]} sqft</p>
      <p><strong>GFA:</strong> {property["GFA Sq. Ft."]} sqft</p>
      <p><strong>Usage:</strong> {property["Usage"]}</p>
      <p><strong>Proposed Height:</strong> {property["Proposed Height Letters"]}</p>
      <p><strong>FAR:</strong> {property["FAR"]}</p>
      <p className="font-semibold text-lg mt-4">
        Total Price: AED {property["TOTAL PRICE"].toLocaleString()}
      </p>
      {property["Location Pin"] && (
        <a
          href={property["Location Pin"]}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline mt-4 inline-block"
        >
          View on Google Maps
        </a>
      )}
    </div>
  );
}
