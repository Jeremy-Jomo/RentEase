import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { UserContext } from "../pages/context/UserContext";

function Rent() {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const location = useLocation();
  const property = location.state ? location.state.property : null;
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [approved, setApproved] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // ✅ Check auth before rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        alert("You must be logged in to rent a property.");
        navigate("/login");
      } else if (user.role !== "tenant") {
        alert("Only tenants can rent properties.");
        navigate("/");
      } else {
        setLoadingUser(false);
      }
    }, 100); // small delay for context hydration

    return () => clearTimeout(timer);
  }, [user, navigate]);

  const handleRent = () => {
    fetch("http://localhost:5000/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + user.token,
      },
      body: JSON.stringify({
        tenant_id: user.id,
        property_id: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Rent request:", data);
        if (data.status === "approved") {
          setStatus("Approved");
          setApproved(true);
        } else {
          setStatus("Pending Approval");
        }
      })
      .catch((err) => console.error("Error creating rental:", err));
  };

  const goToPayment = () => {
    navigate("/payment", { state: { propertyId: id, property } });
  };

  if (loadingUser) return <div>Checking authentication...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Rent Property</h2>

      {property ? (
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{property.title}</h3>
          <p>📍 {property.location}</p>
          <p>💰 KSh {property.rent_price}</p>
          <p className="text-gray-600">{property.description}</p>
        </div>
      ) : (
        <p>Loading property...</p>
      )}

      {!status && (
        <button
          onClick={handleRent}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Request to Rent
        </button>
      )}

      {status && (
        <p className="mt-4 font-semibold text-gray-700">Status: {status}</p>
      )}

      {approved && (
        <button
          onClick={goToPayment}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          Proceed to Payment
        </button>
      )}
    </div>
  );
}

export default Rent;
