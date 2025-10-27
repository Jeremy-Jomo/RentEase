import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:5000";

function LandlordDash() {
  const navigate = useNavigate();
  const [landlord, setLandlord] = useState(null);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    location: "",
    rent_price: "",
    image_url: "",
  });

  // Load landlord + data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    if (user.role !== "landlord") return;

    setLandlord(user);

    fetch(`${API_BASE}/properties`)
      .then((res) => res.json())
      .then((allProperties) => {
        const landlordProps = allProperties.filter(
          (p) => p.landlord_id === user.id
        );
        setProperties(landlordProps);

        return fetch(`${API_BASE}/landlord/bookings?landlord_id=${user.id}`);
      })
      .then((res) => res.json())
      .then((landlordBookings) => {
        setBookings(landlordBookings);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading dashboard:", err);
        setLoading(false);
      });
  }, []);

  // Small toast message
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2500);
  };

  // Handle Delete
  const handleDelete = (propertyId) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    fetch(`${API_BASE}/properties/${propertyId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete property");
        setProperties((prev) =>
          prev.filter((property) => property.id !== propertyId)
        );
        showNotification("Property deleted successfully!", "success");
      })
      .catch(() => showNotification("Failed to delete property", "error"));
  };

  // Handle Edit Start
  const startEditing = (property) => {
    setEditingId(property.id);
    setEditData({
      title: property.title,
      description: property.description,
      location: property.location,
      rent_price: property.rent_price,
      image_url: property.image_url || "",
    });
  };

  // Handle Edit Submit
  const saveEdit = (propertyId) => {
    fetch(`${API_BASE}/properties/${propertyId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update property");
        return res.json();
      })
      .then((updatedProperty) => {
        setProperties((prev) =>
          prev.map((p) => (p.id === propertyId ? updatedProperty : p))
        );
        setEditingId(null);
        showNotification("Property updated successfully!");
      })
      .catch(() => showNotification("Error updating property", "error"));
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
        {landlord && (
          <div className="flex items-center space-x-3">
            <p className="text-gray-700">
              {landlord.name} ({landlord.role})
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
          Bookings Overview
        </h3>
        <p className="text-gray-600 mb-4">
          Total Bookings:{" "}
          <span className="font-semibold">{bookings.length}</span>
        </p>

        {bookings.length === 0 ? (
          <p className="text-gray-600 italic">No bookings yet.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="border rounded-lg p-3 bg-gray-50 flex flex-col gap-1"
              >
                <p>
                  <span className="font-semibold">Property:</span>{" "}
                  {booking.property_title || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Tenant:</span>{" "}
                  {booking.tenant_name || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Start Date:</span>{" "}
                  {booking.start_date}
                </p>
                <p>
                  <span className="font-semibold">End Date:</span>{" "}
                  {booking.end_date}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`${
                      booking.status === "Approved"
                        ? "text-green-600"
                        : booking.status === "Rejected"
                        ? "text-red-600"
                        : "text-gray-600"
                    } font-semibold`}
                  >
                    {booking.status || "Pending"}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Dashboard */}
      <main className="mt-6">
        {/* --- Properties Section --- */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                My Properties
              </h2>
              <p className="text-gray-500">
                Manage your listed rental properties
              </p>
            </div>
            <button
              onClick={() => navigate("/addProperty")}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Add Property
            </button>
          </div>

          {properties.length === 0 ? (
            <p className="text-gray-600 italic">No properties added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
                >
                  {editingId === property.id ? (
                    // Edit Mode
                    <div className="p-4 flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder="Title"
                        value={editData.title}
                        onChange={(e) =>
                          setEditData({ ...editData, title: e.target.value })
                        }
                        className="border p-2 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={editData.location}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            location: e.target.value,
                          })
                        }
                        className="border p-2 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Rent Price"
                        value={editData.rent_price}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            rent_price: e.target.value,
                          })
                        }
                        className="border p-2 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={editData.image_url}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            image_url: e.target.value,
                          })
                        }
                        className="border p-2 rounded"
                      />
                      <textarea
                        placeholder="Description"
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                        className="border p-2 rounded"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => saveEdit(property.id)}
                          className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-400 text-white px-3 py-2 rounded-lg hover:bg-gray-500 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
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
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditing(property)}
                              className="bg-black text-white py-2 px-3 rounded-lg hover:bg-gray-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(property.id)}
                              className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default LandlordDash;
