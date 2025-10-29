import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = "http://127.0.0.1:5000";

const TenantDash = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tenant, setTenant] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [availableProps, setAvailableProps] = useState([]);
  const [filteredProps, setFilteredProps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const [filters, setFilters] = useState({
    location: "",
    minRent: "",
    maxRent: "",
    availableOnly: true,
  });

  // Fetch bookings & properties
  const fetchData = async () => {
    const tenantId = localStorage.getItem("id");

    try {
      const [bookingsRes, propertiesRes] = await Promise.all([
        fetch(`${API_BASE}/bookings?tenant_id=${tenantId}`).then((res) =>
          res.json()
        ),
        fetch(`${API_BASE}/properties`).then((res) => res.json()),
      ]);

      setBookings(bookingsRes || []);
      setAvailableProps(propertiesRes || []);
      setFilteredProps(propertiesRes || []);
    } catch (err) {
      showNotification("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("id");
    const name = localStorage.getItem("name");

    if (!token || role !== "tenant") {
      navigate("/login");
      return;
    }

    setTenant({ id, token, role, name });
    fetchData();
  }, [navigate, location.state?.refresh]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2500);
  };

  const handleLogout = () => {
    localStorage.clear();
    showNotification("Logged out successfully!");
    setTimeout(() => navigate("/login"), 1000);
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...availableProps];

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
      filtered = filtered.filter((p) => p.is_available || p.available);
    }

    setFilteredProps(filtered);
  };

  // Run filter when filters or availableProps change
  useEffect(() => {
    applyFilters();
  }, [filters, availableProps]);

  const resetFilters = () => {
    setFilters({
      location: "",
      minRent: "",
      maxRent: "",
      availableOnly: true,
    });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {notification && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-lg text-white shadow-md ${
            notification.type === "error" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">🏠 PropertyHub</h1>
        {tenant && (
          <div className="flex items-center space-x-3">
            <p className="text-gray-700 font-medium">
              {tenant.name} <span className="text-gray-500">({tenant.role})</span>
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Filter Controls */}
      <section className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Filter Properties
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            className="border p-2 rounded-lg"
          />
          <input
            type="number"
            placeholder="Min Rent"
            value={filters.minRent}
            onChange={(e) =>
              setFilters({ ...filters, minRent: e.target.value })
            }
            className="border p-2 rounded-lg"
          />
          <input
            type="number"
            placeholder="Max Rent"
            value={filters.maxRent}
            onChange={(e) =>
              setFilters({ ...filters, maxRent: e.target.value })
            }
            className="border p-2 rounded-lg"
          />
          <label className="flex items-center space-x-2">
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
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      </section>

      {/* My Bookings */}
      <section className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">My Bookings</h3>
        {bookings.length === 0 ? (
          <p className="text-gray-600 italic">You haven’t made any bookings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm"
              >
                <h4 className="font-semibold text-gray-800">
                  {b.property?.title || "Unnamed Property"}
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  📍 {b.property?.location || "Unknown"}
                </p>
                <p className="text-gray-600 text-sm">
                  💰 Rent: KSh {b.property?.rent_price || "N/A"}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      b.status === "approved"
                        ? "text-yellow-600"
                        : b.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </p>
                {b.status === "approved" && (
                  <button
                    onClick={() =>
                      navigate("/payment", {
                        state: { bookingId: b.id, property: b.property },
                      })
                    }
                    className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Pay Now
                  </button>
                )}
                {b.status === "active" && (
                  <p className="mt-3 text-green-700 font-semibold">Payment completed</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Filtered Properties */}
      <section className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Available Properties
        </h2>
        {filteredProps.length === 0 ? (
          <p className="text-gray-600 italic">No properties match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProps.map((property) => (
              <div
                key={property.id}
                className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-semibold ${
                    property.is_available || property.available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {property.is_available || property.available ? "Available" : "Unavailable"}
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
                    <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                    <p className="text-gray-700 text-sm line-clamp-2">{property.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-gray-800">
                      KSh {parseFloat(property.rent_price).toLocaleString()}
                    </span>
                    <button
                      onClick={() =>
                        navigate(`/property/${property.id}`, { state: { property } })
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
        )}
      </section>
    </div>
  );
};

export default TenantDash;
