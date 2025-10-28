import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PropertyProvider } from "./components/pages/context/PropertyContext";
import { UserProvider } from "./components/pages/context/UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <PropertyProvider>
        <App />
      </PropertyProvider>
    </UserProvider>
  </React.StrictMode>
);
