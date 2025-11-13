import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Stack,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Context/AuthContext";

export default function Logout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // short delay for animation
      await logout();
      setIsLoggingOut(false);
      setIsSuccess(true);
      setTimeout(() => navigate("/auth"), 1500); // redirect after success
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  // Auto redirect if already logged out
  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "85vh",
        px: 2,
      }}
    >
      <AnimatePresence mode="wait">
        {/* Default State */}
        {!isLoggingOut && !isSuccess && (
          <motion.div
            key="logout-card"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.4 }}
            style={{ width: "100%", maxWidth: 500 }}
          >
            <Paper
              elevation={4}
              sx={{
                p: { xs: 3, sm: 5 },
                borderRadius: 3,
                textAlign: "center",
              }}
            >
              <Stack spacing={3} alignItems="center">
                <Avatar
                  src={user?.avatar || "/default-avatar.png"}
                  alt={user?.username || "User"}
                  sx={{ width: 80, height: 80, bgcolor: "success.main" }}
                />

                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {user?.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>

                <Divider flexItem />

                <Typography variant="h6" sx={{ mt: 1 }}>
                  Are you sure you want to log out?
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ mt: 2, width: "100%", justifyContent: "center" }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    fullWidth
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.2,
                    }}
                  >
                    Yes, Logout
                  </Button>

                  <Button
                    variant="outlined"
                    component={Link}
                    to="/"
                    startIcon={<HomeIcon />}
                    fullWidth
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      color: "success.main",
                      borderColor: "success.main",
                      "&:hover": {
                        borderColor: "success.dark",
                        color: "success.dark",
                      },
                    }}
                  >
                    Cancel / Go Home
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </motion.div>
        )}

        {/* Logging Out State */}
        {isLoggingOut && !isSuccess && (
          <motion.div
            key="logging-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Paper
              elevation={4}
              sx={{
                p: { xs: 4, sm: 6 },
                borderRadius: 3,
                textAlign: "center",
                maxWidth: 400,
                mx: "auto",
              }}
            >
              <Stack spacing={3} alignItems="center">
                <CircularProgress color="success" />
                <Typography variant="h6" fontWeight="bold">
                  Logging out…
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please wait a moment.
                </Typography>
              </Stack>
            </Paper>
          </motion.div>
        )}

        {/* Success State */}
        {isSuccess && (
          <motion.div
            key="logout-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Paper
              elevation={4}
              sx={{
                p: { xs: 4, sm: 6 },
                borderRadius: 3,
                textAlign: "center",
                maxWidth: 400,
                mx: "auto",
              }}
            >
              <Stack spacing={3} alignItems="center">
                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
                <Typography variant="h6" fontWeight="bold">
                  You have logged out successfully!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Redirecting to login page…
                </Typography>
              </Stack>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
