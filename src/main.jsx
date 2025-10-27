import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PropertyProvider } from "./components/pages/context/PropertyContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PropertyProvider>
      <App />
    </PropertyProvider>
  </React.StrictMode>
);
