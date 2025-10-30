import React, { useEffect, useState } from "react";
import "./PropertyListing.css";
import logo from "../assets/logo.png";
import { useProperties } from "./pages/context/PropertyContext";
import { useNavigate } from "react-router-dom";

const PropertyListing = () => {
  const { properties, loading } = useProperties();
  const navigate = useNavigate();

  // 🔹 Filter states
  const [filters, setFilters] = useState({
    location: "",
    minRent: "",
    maxRent: "",
    availableOnly: true,
  });

  const [filteredProps, setFilteredProps] = useState([]);

  // 🔹 Filter logic
  const applyFilters = () => {
    let filtered = [...properties];

    if (filters.location) {
      filtered = filtered.filter((p) =>
        p.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.minRent) {
      filtered = filtered.filter(
        (p) => parseFloat(p.rent_price) >= parseFloat(filters.minRent)
      );
    }
    if (filters.maxRent) {
      filtered = filtered.filter(
        (p) => parseFloat(p.rent_price) <= parseFloat(filters.maxRent)
      );
    }
    if (filters.availableOnly) {
      filtered = filtered.filter((p) => p.available);
    }

    setFilteredProps(filtered);
  };

  useEffect(() => {
    if (properties) applyFilters();
  }, [filters, properties]);

  const resetFilters = () => {
    setFilters({
      location: "",
      minRent: "",
      maxRent: "",
      availableOnly: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Fetching available properties...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* ✅ Navbar */}
      <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="RentEase Logo" className="h-10 w-auto" />
            <h1 className="text-xl font-bold text-gray-800">RentEase</h1>
          </div>

          <nav className="hidden md:flex space-x-6 items-center">
            <button
              onClick={() => navigate("/")}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Home
            </button>
            <button className="text-gray-700 hover:text-blue-600 font-medium transition">
              About
            </button>
            <button className="text-gray-700 hover:text-blue-600 font-medium transition">
              Contact
            </button>

            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* ✅ Filter Section */}
      <section className="pt-28 px-6">
        <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-blue-600">🔍</span> Filter Properties
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="number"
              placeholder="Min Rent"
              value={filters.minRent}
              onChange={(e) =>
                setFilters({ ...filters, minRent: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="number"
              placeholder="Max Rent"
              value={filters.maxRent}
              onChange={(e) =>
                setFilters({ ...filters, maxRent: e.target.value })
              }
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <label className="flex items-center space-x-2 text-gray-700">
              <input
                type="checkbox"
                checked={filters.availableOnly}
                onChange={(e) =>
                  setFilters({ ...filters, availableOnly: e.target.checked })
                }
              />
              <span>Available Only</span>
            </label>

            <button
              onClick={resetFilters}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* ✅ Property Listings */}
      <main className="px-6 py-14">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-10 text-gray-800 text-center tracking-tight">
            Explore Available Homes
          </h2>

          {filteredProps.length === 0 ? (
            <p className="text-center text-gray-600 italic">
              No properties match your filters.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProps.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden group"
                >
                  <div className="relative">
                    <img
                      src={property.image_url}
                      alt={property.title}
                      className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span
                      className={`absolute top-3 left-3 text-sm px-3 py-1 rounded-full font-medium ${
                        property.available
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {property.available ? "Available" : "Not Available"}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {property.title}
                    </h3>
                    <p className="text-gray-500">{property.location}</p>
                    <p className="text-blue-600 font-bold mt-2 text-lg">
                      KSh {property.rent_price}
                    </p>
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {property.description}
                    </p>

                    <button
                      className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
                      onClick={() => navigate(`/property/${property.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PropertyListing;
