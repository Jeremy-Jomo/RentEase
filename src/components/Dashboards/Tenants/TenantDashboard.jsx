import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:5000";

function TenantDash() {
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [availableProps, setAvailableProps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Load tenant + their bookings
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    if (user.role !== "tenant") return;

    setTenant(user);

    // Fetch all data
    Promise.all([
      fetch(`${API_BASE}/bookings?tenant_id=${user.id}`).then((res) =>
        res.json()
      ),
      fetch(`${API_BASE}/properties`).then((res) => res.json()),
    ])
      .then(([tenantBookings, allProperties]) => {
        setBookings(tenantBookings);
        const available = allProperties.filter((p) => p.is_available);
        setAvailableProps(available);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading tenant dashboard:", err);
        setLoading(false);
      });
  }, []);

  // Notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2500);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* Toast Notification */}
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
      <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">PropertyHub</h1>
        {tenant && (
          <div className="flex items-center space-x-3">
            <p className="text-gray-700">
              {tenant.name} ({tenant.role})
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* --- Bookings Section --- */}
      <section className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          My Bookings
        </h3>
        {bookings.length === 0 ? (
          <p className="text-gray-600 italic">
            You haven’t made any bookings yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200"
              >
                <h4 className="font-semibold text-gray-800">
                  {b.property?.title || "Unnamed Property"}
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  Location: {b.property?.location || "N/A"}
                </p>
                <p className="text-gray-600 text-sm">
                  Rent: ${b.property?.rent_price || "N/A"}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      b.status === "approved"
                        ? "text-green-600"
                        : b.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </p>
                <p className="text-gray-500 text-sm">
                  Date: {new Date(b.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- Available Properties --- */}
      <section className="bg-white rounded-xl shadow-md p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Available Properties
            </h2>
            <p className="text-gray-500">
              Browse properties available for booking
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            View All
          </button>
        </div>

        {availableProps.length === 0 ? (
          <p className="text-gray-600 italic">
            No properties available right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableProps.slice(0, 4).map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
              >
                <img
                  src={property.image_url || "/placeholder.jpg"}
                  alt={property.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {property.title}
                    </h3>
                    <p className="text-gray-600">{property.location}</p>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {property.description}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-gray-800 font-bold">
                      ${property.rent_price}
                    </p>
                    <button
                      onClick={() =>
                        navigate(`/property/${property.id}`, {
                          state: { property },
                        })
                      }
                      className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 text-sm"
                    >
                      View
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
}

export default TenantDash;
