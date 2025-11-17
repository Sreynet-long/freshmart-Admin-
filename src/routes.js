import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "../src/Context/LanguageContext";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Menu/Sidebar";
import Navbar from "./components/Menu/Navbar";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Reports from "./pages/Reports";
import SettingsAdmin from "./pages/SettingAdmin";
import ResetPassword from "./pages/ResetPassword";

// ProtectedRoute wrapper
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
    { path: "settingAdmin", element: <SettingsAdmin /> },
    { path: "/logout", element: <Logout /> },
  ];

  return (
    <LanguageProvider>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {protectedRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedRoute>{element}</ProtectedRoute>}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </LanguageProvider>
  );
}
