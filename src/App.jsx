import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PropertyProvider } from "./PropertyContext";
import PropertyDetails from "./PropertyDetails";

const App = () => {
  return (
    <PropertyProvider>
      <Router>
        <Routes>
          {/* directly visit /properties/16 or any id you have in backend */}
          <Route path="/properties/:id" element={<PropertyDetails />} />
        </Routes>
      </Router>
    </PropertyProvider>
  );
};

export default App;
