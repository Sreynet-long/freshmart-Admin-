// Sidebar.jsx
"use client";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Stack,
  Typography,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import ContactsIcon from "@mui/icons-material/Contacts";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import "./Sidebar.scss";

// Menu items except logout
const menuItems = [
  { name: "Dashboard", path: "/", icon: <DashboardIcon /> },
  { name: "Products", path: "/products", icon: <Inventory2Icon /> },
  { name: "Orders", path: "/orders", icon: <ShoppingCartIcon /> },
  { name: "Customers", path: "/customers", icon: <PeopleIcon /> },
  { name: "Contacts", path: "/contacts", icon: <ContactsIcon /> },
  { name: "Settings", path: "/settingAdmin", icon: <SettingsIcon /> },
];

export default function Sidebar({ collapsed, toggleSidebar }) {
  const navigate = useNavigate();

  // FULL LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("user");

    navigate("/login"); // redirect to login
  };

  return (
    <div className={collapsed ? "sidebar collapsed" : "sidebar"}>
      <Stack
        direction={collapsed ? "column" : "row"}
        alignItems="center"
        justifyContent={collapsed ? "center" : "space-between"}
        sx={{ p: 1 }}
      >
        {!collapsed && (
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            CMS
          </Typography>
        )}
        <IconButton onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
      </Stack>

      <Divider />

      {/* NORMAL NAV LINKS */}
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
                {!collapsed && <Typography>{item.name}</Typography>}
              </Stack>
            </Tooltip>
          </NavLink>
        ))}

        {/* LOGOUT BUTTON (NOT NAVLINK) */}
        <div
          className="sidebar-link"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          <Tooltip title={collapsed ? "Logout" : ""} placement="right">
            <Stack
              direction="row"
              spacing={collapsed ? 0 : 1.5}
              alignItems="center"
              justifyContent={collapsed ? "center" : "flex-start"}
              sx={{ width: "100%" }}
            >
              <LogoutIcon />
              {!collapsed && <Typography>Logout</Typography>}
            </Stack>
          </Tooltip>
        </div>
      </Stack>
    </div>
  );
}
