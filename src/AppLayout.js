// src/AppLayout.jsx
import React, { useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import Sidebar from "./components/Menu/Sidebar";
import Navbar from "./components/Menu/Navbar";

export default function AppLayout({ children }) {
  const isSmallScreen = useMediaQuery("(max-width:768px)");
  const [collapsed, setCollapsed] = useState(isSmallScreen);

  useEffect(() => {
    setCollapsed(isSmallScreen);
  }, [isSmallScreen]);

  const toggleSidebar = () => setCollapsed(!collapsed);
  const sidebarWidth = collapsed ? 80 : 220;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <div style={{ flex: 1 }}>
        <Navbar />
        <div
          style={{
            padding: 24,
            marginLeft: sidebarWidth,
            marginTop: "28px",
            transition: "margin-left 0.3s",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
