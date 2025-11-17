// src/Context/AuthContext.jsx
import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const initialUser = JSON.parse(localStorage.getItem("user") || "null");
  const initialToken = localStorage.getItem("token") || null;

  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(initialToken);

  // LOGIN
  const login = (tokenValue, userData) => {
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(tokenValue);
    setUser(userData);
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// HOOK
export function useAuth() {
  return useContext(AuthContext);
}
