// frontend/components/PropertyCard.jsx
const PropertyCard = ({ property }) => {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg">
      <h3 className="text-xl font-bold">{property["Property Location"] || "Untitled Plot"}</h3>
      <p className="text-sm text-gray-600">{property["District"]} - {property["City__1"]}</p>
      <p className="font-semibold text-lg text-green-700">
        AED {property["TOTAL PRICE"].toLocaleString()}
      </p>
      <a
        href={`/properties/${property["OFFER NO"]}`}
        className="inline-block mt-2 text-blue-500 underline"
      >
        View Details
      </a>
    </div>
  );
};

export default PropertyCard;
