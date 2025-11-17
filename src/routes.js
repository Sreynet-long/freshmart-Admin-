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
import AppLayout from "./AppLayout";

// ---------------------- ProtectedRoute ----------------------
export function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/auth" replace />;
  return children;
}

// ---------------------- RouterComponent ----------------------
export default function RouterComponent() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Routes>
          {/* Public route */}
          <Route path="/auth" element={<Auth />} />

          {/* Redirect root */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected routes wrapped in persistent layout */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="contacts" element={<Contacts />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settingAdmin" element={<SettingsAdmin />} />
                    <Route path="logout" element={<Logout />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </LanguageProvider>
    </AuthProvider>
  );
}
