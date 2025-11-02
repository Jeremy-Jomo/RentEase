import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://renteasebackend-1.onrender.com/properties/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProperty(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching property details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-600">
        Loading property details...
      </div>
    );
  if (!property)
    return (
      <div className="text-center py-20 text-gray-600">Property not found.</div>
    );

  const handleRentRedirect = () => {
    navigate(`/rent/${property.id}`, { state: { property } });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-gray-900 text-white shadow-md fixed top-0 left-0 right-0 z-50">
        <nav className="flex justify-between items-center px-8 py-4">
          <div
            className="text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            RentEase
          </div>
          <ul className="flex space-x-8 text-lg font-medium">
            <li
              onClick={() => navigate("/")}
              className="hover:text-blue-400 cursor-pointer"
            >
              Home
            </li>
            <li
              onClick={() => navigate("/propertylisting")}
              className="hover:text-blue-400 cursor-pointer"
            >
              Properties
            </li>
            <li className="hover:text-blue-400 cursor-pointer">Contact</li>
          </ul>
        </nav>
      </header>

      <main className="pt-28 px-6 pb-20 flex justify-center">
        <div className="max-w-5xl w-full bg-white shadow-xl rounded-2xl overflow-hidden">
          <img
            src={property.image_url}
            alt={property.title}
            className="w-full h-96 object-cover"
          />
          <div className="p-8 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {property.title}
            </h2>
            <p className="text-gray-700 text-lg">
              <strong>Location:</strong> {property.location}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Price:</strong> KSh {property.rent_price}
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              {property.description}
            </p>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Amenities
            </h3>
            {property.amenities?.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {property.amenities.map((a) => (
                  <li key={a.id}>
                    <span className="font-medium">{a.amenity_name}</span>:{" "}
                    {a.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No amenities listed.</p>
            )}

            <div className="flex justify-end mt-8 space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                ← Back to Properties
              </button>
              <button
                onClick={handleRentRedirect}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Request to Rent
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetails;
