import React from "react";
import { useProperties } from "./pages/context/PropertyContext";
import { useNavigate } from "react-router-dom";

const PropertyListing = () => {
  const { properties, loading } = useProperties();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Getting your properties...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">🏠 RentEase</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full"
          >
            Register
          </button>
        </div>
      </header>

      <main className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Available Properties
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-semibold ${
                  property.is_available
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {property.is_available ? "Available" : "Unavailable"}
              </div>
              <img
                src={property.image_url || "/placeholder.jpg"}
                alt={property.title}
                className="h-52 w-full object-cover"
              />
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {property.location}
                  </p>
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {property.description}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-gray-800">
                    KSh {property.rent_price.toLocaleString()}
                  </span>
                  <button
                    onClick={() =>
                      navigate(`/property/${property.id}`, {
                        state: { property },
                      })
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PropertyListing;
