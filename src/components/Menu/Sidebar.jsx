import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Stack,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import ContactsIcon from "@mui/icons-material/Contacts";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import "./Sidebar.scss";

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
  // Collapse state
  const [collapsed, setCollapsed] = useState(false);

  // Responsive detection
  const isSmallScreen = useMediaQuery("(max-width:768px)");

  // Automatically collapse on small screens
  // useEffect(() => {
  //   if (isSmallScreen) {
  //     setCollapsed(true);
  //   } else {
  //     setCollapsed(false);
  //   }
  // }, [isSmallScreen]);

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
          <Typography variant="h5" sx={{ fontWeight: "bold" }}></Typography>
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
