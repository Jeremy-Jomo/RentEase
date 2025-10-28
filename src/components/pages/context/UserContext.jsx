// src/components/pages/context/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name");

    if (token && role) {
      setUser({ id, token, role, email, name });
    }
  }, []);

  // Save user details after login
  const loginUser = (userData) => {
    localStorage.setItem("id", userData.id);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("email", userData.email);
    localStorage.setItem("name", userData.name);
    setUser(userData);
  };

  // Logout user
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    setUser(null);
  };

  console.log("UserContext loaded:", user);

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
