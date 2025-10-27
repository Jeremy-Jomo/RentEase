// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PropertyProvider } from "./PropertyDetailsContext";
import PropertyListing from "./components/PropertyListing";
import Login from "./components/Auth/LoginPage/Login";
import Register from "./components/Auth/Register/Register";
import PropertyDetails from "./PropertyDetails";
import LandlordDash from "./components/Dashboards/LandlordDash";
import AddProperty from "./components/Dashboards/AddProperty";

function App() {
  return (
    <PropertyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PropertyListing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/landlord-dashboard" element={<LandlordDash />} />
          <Route path="/addProperty" element={<AddProperty />} />
        </Routes>
      </Router>
    </PropertyProvider>
  );
}

export default App;
