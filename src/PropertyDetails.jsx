import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PropertyContext } from "./PropertyContext";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties, setProperties } = useContext(PropertyContext);
  const [property, setProperty] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/properties/${id}`)
      .then((res) => res.json())
      .then((data) => setProperty(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!property) return <p>Loading...</p>;

  return (
    <div>
      <h2>{property.title}</h2>
      <p>Location: {property.location}</p>
      <p>Rent Price: {property.rent_price}</p>
      <h3>Amenities:</h3>
      <ul>
        {property.amenities && property.amenities.length > 0 ? (
          property.amenities.map((a) => (
            <li key={a.id}>
              {a.amenity_name}: {a.description}
            </li>
          ))
        ) : (
          <li>No amenities listed</li>
        )}
      </ul>
      <button onClick={() => navigate("/")}>Back to Properties</button>
    </div>
  );
};

export default PropertyDetails;
