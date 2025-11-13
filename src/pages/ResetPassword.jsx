// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client/react";
import { RESET_PASSWORD } from "../schema/User";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token"); // get token from URL

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD, {
    onCompleted: (data) => {
      const res = data.resetPassword;
      if (res.isSuccess) {
        setMessage(res.messageEn);
        setError("");
        // Redirect to login after 3 seconds
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(res.messageEn);
        setMessage("");
      }
    },
    onError: (err) => {
      setError(err.message);
      setMessage("");
    },
  });

  useEffect(() => {
    if (!token) setError("Invalid or missing token.");
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      return setError("Please enter and confirm your new password.");
    }
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    resetPassword({ variables: { token, newPassword } });
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 10,
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h5" align="center">
          Reset Password
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || !token}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </Stack>
        </form>

        {/* Feedback Messages */}
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    </Box>
  );
};

export default ResetPassword;
