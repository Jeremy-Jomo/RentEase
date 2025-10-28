import React from "react";
import "./PropertyListing.css";
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
        <nav className="navbar-container flex justify-between items-center px-8 py-4">
          <div className="logo text-2xl font-bold tracking-wide">RentEase</div>
          <ul className="nav-links flex space-x-8 text-lg">
            <li className="hover:text-blue-400 cursor-pointer transition-colors duration-200">
              Home
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors duration-200">
              Properties
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition-colors duration-200">
              Contact
            </li>
          </ul>
        </nav>
      </header>

      <section className="hero-section relative isolate px-6 pt-14 lg:px-8">
        <div
          className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: `url(/src/assets/francesca-tosolini-tHkJAMcO3QE-unsplash.jpg)`,
          }}
        >
          <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
            <div className="text-center max-w-4xl">
              <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
                Find Your New Home
              </h1>
              <p className="mt-8 text-lg text-gray-200 sm:text-xl/8">
                Discover affordable and beautiful homes for rent across Kenya.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 flex-wrap gap-y-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
                  Get Started
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-lg font-semibold transition-all duration-200">
                  Learn More →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
