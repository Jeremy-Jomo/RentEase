import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../pages/context/UserContext";

const API_BASE = "https://renteasebackend-1.onrender.com";

function LandlordDash() {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(UserContext);
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

  // >>> Added code starts
  const [income, setIncome] = useState(0);
  // >>> Added code ends

  // ✅ Load landlord data safely
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "landlord") {
      navigate("/");
      return;
    }

    const landlordId = user.id || JSON.parse(localStorage.getItem("user"))?.id;

    if (!landlordId) {
      console.error("Landlord ID missing");
      return;
    }

    // Fetch landlord properties
    fetch(`${API_BASE}/properties`)
      .then((res) => res.json())
      .then((allProperties) => {
        const landlordProps = allProperties.filter(
          (p) => p.landlord_id === landlordId
        );
        setProperties(landlordProps);

        // Fetch landlord bookings using ID
        return fetch(`${API_BASE}/landlord/bookings?landlord_id=${landlordId}`);
      })
      .then((res) => res.json())
      .then((landlordBookings) => {
        setBookings(landlordBookings);
        setLoading(false);

        // >>> Added code starts
        // Fetch landlord income summary
        fetch(`${API_BASE}/landlord/income?landlord_id=${landlordId}`)
          .then((r) => r.json())
          .then((data) => {
            if (data && typeof data.income !== "undefined") {
              setIncome(data.income);
            }
          })
          .catch((err) => {
            console.error("Error fetching landlord income:", err);
          });
        // >>> Added code ends
      })
      .catch((err) => {
        console.error("Error loading dashboard:", err);
        setLoading(false);
      });
  }, [user, navigate]);

  // ✅ Toast helper
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2500);
  };

  // ✅ Delete Property
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

  // ✅ Start Editing
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

  // ✅ Save Edit
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

  // ✅ Approve Booking
  const handleApproveBooking = (bookingId) => {
    fetch(`${API_BASE}/bookings/${bookingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Approved" }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to approve booking");
        return res.json();
      })
      .then((updatedBooking) => {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? updatedBooking : b))
        );
        showNotification("Booking approved successfully!", "success");
      })
      .catch(() => showNotification("Error approving booking", "error"));
  };

  // ✅ Delete Booking
  const handleDeleteBooking = (bookingId) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    fetch(`${API_BASE}/bookings/${bookingId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete booking");
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        showNotification("Booking deleted successfully!", "success");
      })
      .catch(() => showNotification("Failed to delete booking", "error"));
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* ✅ Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-lg text-white shadow-md ${
            notification.type === "error" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* ✅ Header */}
      <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            ← Back to Home
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Landlord Dashboard
          </h1>
        </div>

        {user && (
          <div className="flex items-center space-x-3">
            <p className="text-gray-700">
              {user.name} ({user.role})
            </p>

            {/* >>> Added code starts */}
            <div className="text-right mr-4">
              <p className="text-sm text-gray-500">Total income</p>
              <p className="text-lg font-semibold text-green-700">
                KSh {Number(income).toLocaleString()}
              </p>
            </div>
            {/* >>> Added code ends */}

            <button
              onClick={() => {
                logoutUser();
                navigate("/login");
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* ✅ Bookings Section */}
      <section className="bg-white rounded-xl shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Bookings Overview
        </h3>
        <p className="text-gray-600 mb-4">
          Total Bookings:{" "}
          <span className="font-semibold">{bookings.length}</span>
        </p>

        {bookings.length === 0 ? (
          <p className="text-gray-600 italic">
            No bookings yet for your properties.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg mb-1">
                    {booking.property?.title || "Property"}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Location: {booking.property?.location || "N/A"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Rent: ${booking.property?.rent_price || "N/A"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Tenant: {booking.tenant_name || "Unknown"}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Date: {new Date(booking.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        booking.status === "approved"
                          ? "text-green-600"
                          : booking.status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </p>
                </div>

                <div className="flex gap-2 justify-end mt-3">
                  {booking.status === "pending" && (
                    <button
                      onClick={() => handleApproveBooking(booking.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteBooking(booking.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ✅ Properties Section */}
      <main className="mt-6">
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
