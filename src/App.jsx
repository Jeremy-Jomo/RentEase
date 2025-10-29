import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PropertyProvider } from "./PropertyDetailsContext";
import PropertyListing from "./components/PropertyListing";
import Login from "./components/Auth/LoginPage/Login";
import Register from "./components/Auth/Register/Register";
import PropertyDetails from "./PropertyDetails";
import BookingPage from "./components/BookingPage/BookingPage";
import LandlordDash from "./components/Dashboards/Landlord/LandlordDash";
import AddProperty from "./components/Dashboards/Landlord/AddProperty";
import TenantDash from "./components/Dashboards/Tenants/TenantDashboard";
import LandingPage from "./components/pages/landingpage/landingpage";
import AdminDashboard from "./components/pages/AdminDashboard";
import Rent from "./components/pages/Rent";
import Payment from "./components/pages/Payment";

function App() {
  return (
    <PropertyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/propertylisting" element={<PropertyListing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/BookingPage" element={<BookingPage />} />
          <Route path="/landlord-dashboard" element={<LandlordDash />} />
          <Route path="/addProperty" element={<AddProperty />} />
          <Route path="/tenant-dashboard" element={<TenantDash />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/rent/:id" element={<Rent />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </Router>
    </PropertyProvider>
  );
}

export default App;
