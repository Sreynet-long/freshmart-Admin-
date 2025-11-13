"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { useMutation } from "@apollo/client/react";
import { SIGN_UP_USER_FORM, GET_ADMINS } from "../schema/User";

export default function SignupPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const emailRef = useRef(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [signupUserForm, { loading }] = useMutation(SIGN_UP_USER_FORM);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const { username, email, password } = form;

      const { data } = await signupUserForm({
        variables: { input: { username, email, password, role: "Admin" } },
        update(cache, { data: { signupUserForm } }) {
          if (signupUserForm.isSuccess) {
            const newAdmin = signupUserForm.data; // adjust according to backend

            // Read existing admins from cache
            const existing = cache.readQuery({ query: GET_ADMINS });

            if (existing?.getAdmins) {
              cache.writeQuery({
                query: GET_ADMINS,
                data: { getAdmins: [newAdmin, ...existing.getAdmins] },
              });
            }
          }
        },
      });

      if (data.signupUserForm.isSuccess) {
        setSnackbar({
          open: true,
          message: "Admin account created successfully!",
          severity: "success",
        });
        setForm({ username: "", email: "", password: "" });
      } else {
        // Friendly error message
        setSnackbar({
          open: true,
          message: data.signupUserForm.messageEn.includes("already registered")
            ? "This email is already registered as an admin."
            : data.signupUserForm.messageEn,
          severity: "error",
        });

        // Focus on email field
        if (emailRef.current) emailRef.current.focus();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Signup failed: " + error.message,
        severity: "error",
      });
      if (emailRef.current) emailRef.current.focus();
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box p={3} maxWidth={500} mx="auto">
      <Typography variant="h4" gutterBottom>
        Admin Signup
      </Typography>

      <Card variant="outlined">
        <CardContent>
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            inputRef={emailRef}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSignup}
            disabled={loading}
            fullWidth
            required
            sx={{ mt: 2 }}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
