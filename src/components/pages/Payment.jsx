import { useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../pages/context/UserContext";

function Payment() {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const propertyId = location.state ? location.state.propertyId : null;
  const property = location.state ? location.state.property : null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    setFormData(function (prev) {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:5000/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({
        tenant_id: user.id,
        property_id: propertyId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        amount: formData.amount,
      }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        console.log("Payment processed:", data);
        setMessage("Payment successful! Landlord has been notified.");
      })
      .catch(function (err) {
        console.error("Payment error:", err);
        setMessage("Payment failed. Try again.");
      });
  }

  return (
    <div>
      <h2>Make Payment</h2>

      {property ? (
        <div>
          <h3>{property.title}</h3>
          <p>Location: {property.location}</p>
          <p>Rent Price: KSh {property.rent_price}</p>
        </div>
      ) : (
        <p>Property details unavailable.</p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Email: </label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Phone: </label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Amount: </label>
          <input
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Pay Now</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Payment;
