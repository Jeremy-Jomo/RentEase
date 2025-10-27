// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PropertyListing from "./components/PropertyListing";
import Login from "./Components/LoginPage/Login";
import Register from "./Components/Register/Register";
import PropertyDetails from "./PropertyDetails";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page (default route) */}
        <Route path="/" element={<PropertyListing />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Property details route */}
        <Route path="/property/:id" element={<PropertyDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
