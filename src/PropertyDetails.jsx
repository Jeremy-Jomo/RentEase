import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PropertyContext } from "./PropertyDetailsContext";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties } = useContext(PropertyContext);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/properties/${id}`)
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

  if (loading) {
    return (
      <div className="text-center py-20 text-lg text-gray-600">
        Loading property details...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Property not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Navbar */}
      <header className="bg-gray-900 text-white shadow-md fixed top-0 left-0 right-0 z-50">
        <nav className="flex justify-between items-center px-8 py-4">
          <div
            className="text-2xl font-bold tracking-wide cursor-pointer"
            onClick={() => navigate("/")}
          >
            RentEase
          </div>
          <ul className="flex space-x-8 text-lg font-medium">
            <li
              className="hover:text-blue-400 cursor-pointer transition-colors duration-200"
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className="hover:text-blue-400 cursor-pointer transition-colors duration-200"
              onClick={() => navigate("/")}
            >
              Properties
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors duration-200">
              Contact
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-28 px-6 pb-20 flex justify-center">
        <div className="max-w-5xl w-full bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Image */}
          <img
            src={property.image_url}
            alt={property.title}
            className="w-full h-96 object-cover"
          />

          {/* Details */}
          <div className="p-8 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {property.title}
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <p className="text-gray-700 text-lg">
                <strong>Location:</strong> {property.location}
              </p>
              <p className="text-gray-700 text-lg">
                <strong>Price:</strong>{" "}
                <span className="text-indigo-600 font-semibold">
                  KSh {property.rent_price}
                </span>
              </p>
            </div>

            <p className="text-gray-700 text-base leading-relaxed">
              {property.description}
            </p>

            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Amenities
              </h3>
              {property.amenities && property.amenities.length > 0 ? (
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
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => navigate("/propertylisting")}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                ← Back to Properties
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetails;
