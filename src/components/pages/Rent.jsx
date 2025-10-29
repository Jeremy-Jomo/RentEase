import { useContext, useState, useEffect } from "react";
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

  useEffect(() => {
    if (!user) {
      alert("You must be logged in to rent a property.");
      navigate("/login");
    } else if (user.role !== "tenant") {
      alert("Only tenants can rent properties.");
      navigate("/");
    }
  }, [user]);

  function handleRent() {
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
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        console.log("Rent request:", data);
        if (data.status === "approved") {
          setStatus("Approved");
          setApproved(true);
        } else {
          setStatus("Pending Approval");
        }
      })
      .catch(function (err) {
        console.error("Error creating rental:", err);
      });
  }

  function goToPayment() {
    navigate("/payment", { state: { propertyId: id, property } });
  }

  return (
    <div>
      <h2>Rent Property</h2>

      {property ? (
        <div>
          <h3>{property.title}</h3>
          <p>Location: {property.location}</p>
          <p>Price: KSh {property.rent_price}</p>
          <p>{property.description}</p>
        </div>
      ) : (
        <p>Loading property...</p>
      )}

      {!status && <button onClick={handleRent}>Request to Rent</button>}

      {status && <p>Status: {status}</p>}

      {approved && (
        <button onClick={goToPayment}>Proceed to Payment</button>
      )}
    </div>
  );
}

export default Rent;
