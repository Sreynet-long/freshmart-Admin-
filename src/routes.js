// src/RouterComponent.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./Context/LanguageContext";
import { AuthProvider, useAuth } from "./Context/AuthContext";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Contacts from "./pages/Contacts";
import Reports from "./pages/Reports";
import SettingsAdmin from "./pages/SettingAdmin";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Sidebar from "./components/Menu/Sidebar";
import Navbar from "./components/Menu/Navbar";

// ProtectedRoute
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/auth" replace />;

  return (
    <div className="app-layout" style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Navbar />
        <div style={{ padding: 24, marginLeft: 220, marginTop: "25px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function RouterComponent() {
  const protectedRoutes = [
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/products", element: <Products /> },
    { path: "/orders", element: <Orders /> },
    { path: "/customers", element: <Customers /> },
    { path: "/contacts", element: <Contacts /> },
    { path: "/reports", element: <Reports /> },
    { path: "/settingAdmin", element: <SettingsAdmin /> },
    { path: "/logout", element: <Logout /> },
  ];

  return (
    <AuthProvider>
      <LanguageProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Navigate to="/auth" replace />} />

          {/* Protected routes */}
          {protectedRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
          ))}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </LanguageProvider>
    </AuthProvider>
  );
}
