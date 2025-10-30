import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./context/UserContext";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const { user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    const token = user?.token || localStorage.getItem("token");
    const role = user?.role || localStorage.getItem("role");

    if (!token || role !== "admin") {
      console.warn("Unauthorized access. Redirecting to login...");
      navigate("/login");
      return;
    }

    Promise.all([
      fetch("http://127.0.0.1:5000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((err) => console.error("Error fetching users:", err)),

      fetch("http://127.0.0.1:5000/properties")
        .then((res) => res.json())
        .then((data) => setProperties(data))
        .catch((err) => console.error("Error fetching properties:", err)),

      fetch("http://127.0.0.1:5000/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setBookings(data))
        .catch((err) => console.error("Error fetching bookings:", err)),
    ]).finally(() => setLoading(false));
  }, [user, navigate]);

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  );

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };


  const handleDeleteUser = async (userId) => {
    const token = user?.token || localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId));
      } else {
        console.error("Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };


  const handleDeleteProperty = async (propertyId) => {
    const token = user?.token || localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/properties/${propertyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProperties(properties.filter((p) => p.id !== propertyId));
      } else {
        console.error("Failed to delete property");
      }
    } catch (err) {
      console.error("Error deleting property:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black px-8 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Manage users, properties, and bookings</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Logout
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-gray-500">Total Users</p>
          <h2 className="text-3xl font-semibold mt-2">{users.length}</h2>
        </div>
        <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-gray-500">Total Properties</p>
          <h2 className="text-3xl font-semibold mt-2">{properties.length}</h2>
        </div>
        <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-gray-500">Total Bookings</p>
          <h2 className="text-3xl font-semibold mt-2">{bookings.length}</h2>
        </div>
        <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-gray-500">Confirmed Bookings</p>
          <h2 className="text-3xl font-semibold mt-2">
            {confirmedBookings.length}
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {["Overview", "Users", "Properties", "Bookings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-medium transition border-b-2 ${
                activeTab === tab
                  ? "border-black text-black"
                  : "border-transparent text-gray-700 hover:text-black hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Recent Activity */}
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <ul className="text-gray-700 space-y-2 list-disc list-inside">
              <li>{users.length} users registered</li>
              <li>{properties.length} properties listed</li>
              <li>{bookings.length} total bookings</li>
              <li>{confirmedBookings.length} confirmed bookings</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === "Users" && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Date Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{u.name}</td>
                    <td className="py-3 px-4">{u.email}</td>
                    <td className="py-3 px-4 capitalize">{u.role}</td>
                    <td className="py-3 px-4">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "Properties" && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Properties</h2>
          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Landlord Name</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{p.title}</td>
                    <td className="py-3 px-4">{p.location}</td>
                    <td className="py-3 px-4">{p.rent_price}</td>
                    <td className="py-3 px-4">{p.landlord_name}</td>
                    <td className="py-3 px-4">
                      {p.available ? "Available" : "Unavailable"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteProperty(p.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "Bookings" && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Bookings</h2>
          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Tenant</th>
                  <th className="py-3 px-4">Check-in</th>
                  <th className="py-3 px-4">Check-out</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{b.property_title}</td>
                    <td className="py-3 px-4">{b.tenant_name}</td>
                    <td className="py-3 px-4">
                      {new Date(b.check_in).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(b.check_out).toLocaleDateString()}
                    </td>
                    <td
                      className={`py-3 px-4 font-medium ${
                        b.status === "confirmed"
                          ? "text-green-600"
                          : b.status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {b.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default AdminDashboard;
