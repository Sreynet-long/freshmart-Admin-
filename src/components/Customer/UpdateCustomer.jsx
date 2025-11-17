"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Drawer,
  Box,
  Stack,
  Typography,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  Fade,
  Grid,
  Alert,
} from "@mui/material";
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMutation } from "@apollo/client/react";
import { UPDATE_USER } from "../../schema/User";

export default function UpdateCustomer({ open, handleClose, userId, user, setRefetch }) {
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const firstFieldRef = useRef(null);

  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    onCompleted: ({ updateUser }) => {
      if (updateUser?.isSuccess) {
        setFeedback({ type: "success", message: updateUser.messageEn || "Customer updated successfully" });
        setTimeout(() => {
          if (setRefetch) setRefetch();
          handleClose();
        }, 1000);
      } else {
        setFeedback({ type: "error", message: updateUser?.messageEn || "Update failed" });
      }
    },
    onError: (error) => {
      setFeedback({ type: "error", message: error.message || "Something went wrong" });
    },
  });

  const initialValues = {
    username: user?.username || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    phoneNumber: Yup.string(),
  });

  const handleSubmit = (values) => {
    if (!userId) {
      setFeedback({ type: "error", message: "User ID is missing" });
      return;
    }
    setFeedback({ type: "", message: "" });
    updateUser({ variables: { id: userId, input: values } }); // ✅ GraphQL variable name "id"
  };

  useEffect(() => {
    if (open) {
      setFeedback({ type: "", message: "" });
      setTimeout(() => firstFieldRef.current?.focus(), 300); // autofocus first field
    }
  }, [open]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 450 },
          borderRadius: { xs: 0, sm: "12px 0 0 12px" },
          bgcolor: "background.paper",
          boxShadow: 4,
        },
      }}
    >
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ values, errors, touched, handleChange, handleBlur, dirty }) => (
          <Form style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.default" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">
                  Update Customer
                </Typography>
                <IconButton onClick={handleClose} sx={{ color: "red" }}>
                  <DoDisturbOnOutlinedIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>

            {/* Content */}
            <Fade in={open} timeout={500}>
              <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
                {feedback.message && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={2}>
                      <TextField
                        label="Username"
                        name="username"
                        fullWidth
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.username && Boolean(errors.username)}
                        helperText={touched.username && errors.username}
                        disabled={loading}
                        inputRef={firstFieldRef} // autofocus
                      />
                      <TextField
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        disabled={loading}
                      />
                      <TextField
                        label="Phone Number"
                        name="phoneNumber"
                        fullWidth
                        value={values.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                        helperText={touched.phoneNumber && errors.phoneNumber}
                        disabled={loading}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Fade>

            {/* Footer */}
            <Box sx={{ borderTop: "1px solid", borderColor: "divider", p: 2, display: "flex", justifyContent: "space-between" }}>
              <Button onClick={handleClose} disabled={loading}>Cancel</Button>
              <Button variant="contained" type="submit" disabled={loading || !dirty || !values.username.trim()} sx={{ minWidth: 120 }}>
                {loading ? <CircularProgress size={24} /> : "Update"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}
