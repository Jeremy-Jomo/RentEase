// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PropertyProvider } from "./PropertyDetailsContext";
import PropertyListing from "./components/PropertyListing";
import Login from "./components/Auth/LoginPage/Login";
import Register from "./components/Auth/Register/Register";
import PropertyDetails from "./PropertyDetails";

function App() {
  return (
    <PropertyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PropertyListing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
        </Routes>
      </Router>
    </PropertyProvider>
  );
}

export default App;
