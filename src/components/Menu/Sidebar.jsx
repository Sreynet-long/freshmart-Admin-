import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Stack, Typography, Divider, IconButton, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import ContactsIcon from "@mui/icons-material/Contacts";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import "./Sidebar.scss";

// Menu definition
const menuItems = [
  { name: "Dashboard", path: "/", icon: <DashboardIcon /> },
  { name: "Products", path: "/products", icon: <Inventory2Icon /> },
  { name: "Orders", path: "/orders", icon: <ShoppingCartIcon /> },
  { name: "Customers", path: "/customers", icon: <PeopleIcon /> },
  { name: "Contacts", path: "/contacts", icon: <ContactsIcon /> },
  // { name: "Reports", path: "/reports", icon: <AssessmentIcon /> },
  { name: "Settings", path: "/settingAdmin", icon: <SettingsIcon /> },
  { name: "Logout", path: "/logout", icon: <LogoutIcon /> },
];

export default function Sidebar() {
  // Sidebar collapsed state (manual toggle only)
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className={collapsed ? "sidebar collapsed" : "sidebar"}>
      {/* Sidebar Header */}
      <Stack
        direction={collapsed ? "column" : "row"}
        alignItems="center"
        justifyContent={collapsed ? "center" : "space-between"}
        sx={{ p: 0.9 }}
      >
        {!collapsed && (
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            FreshMart
          </Typography>
        )}
        <IconButton onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
      </Stack>

      <Divider sx={{ top: 0 }} />

      {/* Menu Items */}
      <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <Tooltip title={collapsed ? item.name : ""} placement="right">
              <Stack
                direction="row"
                spacing={collapsed ? 0 : 1.5}
                alignItems="center"
                justifyContent={collapsed ? "center" : "flex-start"}
                sx={{ width: "100%" }}
              >
                {item.icon}
                {!collapsed && (
                  <Typography variant="body1">{item.name}</Typography>
                )}
              </Stack>
            </Tooltip>
          </NavLink>
        ))}
      </Stack>
    </div>
  );
}
