import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Stack,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Button,
  Divider,
  Badge,
} from "@mui/material";
import { Notification } from "iconsax-react";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../Context/LanguageContext";
import CambodiaFlag from "../../assets/Image/cambodiaflag.png";
import EnglishFlag from "../../assets/Image/englishflag.png";

export default function Navbar() {
  const navigate = useNavigate();
  const { language, changeLanguage } = useContext(LanguageContext);

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElLang, setAnchorElLang] = useState(null);

  const openUserMenu = Boolean(anchorElUser);
  const openLangMenu = Boolean(anchorElLang);

  const user = JSON.parse(localStorage.getItem("user")); // ✅ get stored user info
  const username = user?.username || "Admin";

  const handleUserMenuOpen = (e) => setAnchorElUser(e.currentTarget);
  const handleUserMenuClose = () => setAnchorElUser(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    handleUserMenuClose();
    navigate("/auth", { replace: true }); // ✅ redirect to login/signup page
  };

  const handleLangMenuOpen = (e) => setAnchorElLang(e.currentTarget);
  const handleLangMenuClose = () => setAnchorElLang(null);

  const languages = [
    { code: "kh", name: "ភាសាខ្មែរ", flag: CambodiaFlag },
    { code: "en", name: "English", flag: EnglishFlag },
  ];

  const selectedLang = languages.find((l) => l.code === language);

  const handleFlagChange = (lang) => {
    changeLanguage(lang.code);
    handleLangMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        overflowX: "auto",
        zIndex: 1200,
        width: "100%",
        backgroundColor: "#fff",
        borderBottom: "1px solid #e0e0e0",
        top: 0,
      }}
      className="topbar-container"
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 80 }}>
        {/* === Left side: Logo + Title === */}
        <Stack direction="row" spacing={1} alignItems="center">
          <img
            src="/freshmart-icon.png"
            alt="FreshMart Logo"
            style={{ width: 48, height: 48, objectFit: "contain" }}
          />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
            FreshMart Admin
          </Typography>
        </Stack>

        {/* === Right side === */}
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Welcome message */}
          <Typography
            variant="body1"
            sx={{ color: "#333", fontWeight: 500, mr: 1 }}
          >
            {language === "Kh" ? `សួស្តី, ${username}` : `Welcome, ${username}`}
          </Typography>

          {/* Notification */}
          {/* <IconButton size="medium" color="success">
            <Badge badgeContent={0} color="error">
              <Notification size={24} color="#216e1aff" />
            </Badge>
          </IconButton> */}

          {/* Language Selector */}
          {/* <Button
            onClick={handleLangMenuOpen}
            startIcon={
              <Avatar src={selectedLang.flag} sx={{ width: 24, height: 24 }} />
            }
            sx={{ textTransform: "none", color: "#333" }}
          >
            {selectedLang.name}
          </Button> */}
          {/* <Menu
            anchorEl={anchorElLang}
            open={openLangMenu}
            onClose={handleLangMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.code} onClick={() => handleFlagChange(lang)}>
                <Avatar src={lang.flag} sx={{ width: 24, height: 24, mr: 1 }} />
                {lang.name}
              </MenuItem>
            ))}
          </Menu> */}

          {/* User avatar + menu */}
          <IconButton onClick={handleUserMenuOpen}>
            <Avatar alt={username} src="/avatar.png" />
          </IconButton>
          <Menu
            anchorEl={anchorElUser}
            open={openUserMenu}
            onClose={handleUserMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Typography
              sx={{
                px: 2,
                py: 1,
                fontWeight: 500,
                borderBottom: "1px solid #eee",
              }}
            >
              
              Logged in as: ${username}
            </Typography>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <IoLogOutOutline style={{ marginRight: 8 }} />
              Logout
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
