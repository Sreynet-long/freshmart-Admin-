"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useMutation } from "@apollo/client/react";
import { SIGN_UP_USER_FORM } from "../../schema/User";

export default function CreateAdmin({ open, setOpen, setRefetch }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [signupUserForm, { loading }] = useMutation(SIGN_UP_USER_FORM);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      await signupUserForm({
        variables: {
          input: {
            username: form.username,
            email: form.email,
            password: form.password,
            phoneNumber: form.phoneNumber,
            checked: true, // admin active by default
            role: "Admin", // ensure backend accepts role if defined
          },
        },
      });

      setForm({ username: "", email: "", password: "", phoneNumber: "" });
      setSnackbar({
        open: true,
        message: "Admin created successfully!",
        severity: "success",
      });

      setOpen(false);
      if (setRefetch) setRefetch(); // refetch admin list
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to create admin",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create New Admin</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
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
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
}
