import React from "react";
import "./PropertyListing.css";
import logo from "../assets/logo1.png";

import { useProperties } from "./pages/context/PropertyContext";
import { useNavigate } from "react-router-dom";
import PropertyDetails from "../PropertyDetails";

const PropertyListing = () => {
  const { properties, loading } = useProperties();
  const navigate = useNavigate();

  if (loading) {
    return <div className="loading">getting your properties...</div>;
  }

  return (
    <div className="property-page">
      <header className="navbar bg-gray-900 text-white shadow-md">
        <nav className="absolute top-0 left-0 w-full bg-black z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="RentEase Logo" className="h-20 w-auto" />
              <h1 className="text-black font-bold text-white drop-shadow-lg">
                RentEase
              </h1>
            </div>

            <div className="hidden md:flex space-x-6">
              <div className="flex space-x-6">
                <button
                  onClick={() => navigate("/")}
                  className="text-black-700 hover:text-black font-medium"
                >
                  Home
                </button>
                <button className="text-black-700 hover:text-black font-medium">
                  About
                </button>
                <button className="text-black-700 hover:text-black font-medium">
                  Contact
                </button>
              </div>
              <a
                onClick={() => navigate("/register")}
                className="bg-white text-black px-5 py-2 rounded-lg hover:bg-gray-200 transition font-semibold"
              >
                Get Started
              </a>
            </div>
          </div>
        </nav>
      </header>

      

      <main className="main-content">
        <div className="content-container">
          <div className="section-header">
            <h2 className="section-title">Available Properties</h2>
          </div>
          

          <div className="properties-container">
            {properties.map((property) => (
              <div key={property.id} className="property-card">
                <div
                  className={`status-badge ${
                    property.available ? "available" : "unavailable"
                  }`}
                >
                  {property.available ? "Available" : "Not Available"}
                </div>
                <img
                  src={property.image_url}
                  alt={property.title}
                  className="property-image"
                />
                <div className="property-details">
                  <h3>{property.title}</h3>
                  <p className="location">{property.location}</p>
                  <p className="price">KSh {property.rent_price}</p>
                  <p className="description">{property.description}</p>
                  <button
                    className="details-button"
                    onClick={() => {
                      navigate(`/property/${property.id}`);
                    }}
                  >
                    Property Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyListing;
