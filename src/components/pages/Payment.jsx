import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../pages/context/UserContext";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const bookingId = location.state?.bookingId || null;
  const property = location.state?.property || null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: property ? property.rent_price : "",
  });

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (property) {
      setFormData((prev) => ({ ...prev, amount: property.rent_price }));
    }
  }, [property]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (submitting) return;
    setSubmitting(true);
    setMessage("Processing payment...");

    fetch("https://renteasebackend-1.onrender.com/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({
        booking_id: bookingId,
        tenant_id: user.id,
        amount: formData.amount,
        payment_method: "digital_wallet",
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            // backend may return an error message
            throw new Error(err.error || err.message || "Payment failed");
          });
        }
        return res.json();
      })
      .then((data) => {
        // >>> Added code starts
        // Use message from server if present and navigate with refresh flag
        setMessage(
          data?.message ? `${data.message} Redirecting to dashboard...` : "Payment successful! Redirecting..."
        );
        // <<< Added code ends

        // Give UI time to show success and then return to tenant dashboard
        setTimeout(() => {
          navigate("/tenant-dashboard", { state: { refresh: true } });
        }, 1200);
      })
      .catch((err) => {
        console.error("Payment error:", err);
        setMessage(err.message || "Payment failed. Try again.");
        setSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Make Payment</h2>

      {property ? (
        <div className="bg-white shadow-md rounded-xl p-6 mb-6 w-full max-w-md">
          <h3 className="text-xl font-semibold">{property.title}</h3>
          <p className="text-gray-600">Location: {property.location}</p>
          <p className="text-gray-600">
            Rent Price: KSh {property.rent_price.toLocaleString()}
          </p>
        </div>
      ) : (
        <p className="text-red-600 mb-4">Property details unavailable.</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Name:</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email:</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            type="email"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Phone:</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Amount:</label>
          <input
            name="amount"
            value={formData.amount}
            className="w-full border border-gray-300 rounded px-3 py-2"
            type="number"
            readOnly
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full ${submitting ? "opacity-60 cursor-not-allowed" : ""} bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold`}
        >
          {submitting ? "Processing..." : "Pay Now"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
}

export default Payment;
