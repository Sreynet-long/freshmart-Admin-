"use client";
import React from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_USER } from "../../schema/User";
import { Formik, Form, Field } from "formik";
import { TextField, Button, Grid, Stack } from "@mui/material";
import { useAuth } from "../../Context/AuthContext";

export default function UpdateCustomer({ userId, username, email, phoneNumber, close, setRefetch }) {
  const { setAlert } = useAuth();
  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      const res = data.updateUser;
      if (res?.isSuccess) {
        setAlert(true, "success", res.messageEn || "User updated successfully");
        if (typeof setRefetch === "function") setRefetch();
        close();
      } else {
        setAlert(true, "error", res.messageEn || "Update failed");
      }
    },
    onError: (error) => {
      setAlert(true, "error", error.message || "Something went wrong");
    },
  });

  return (
    <Formik
      initialValues={{ username, email, phoneNumber }}
      onSubmit={(values, { setSubmitting }) => {
        if (!userId) {
          setAlert(true, "error", "User ID is missing");
          setSubmitting(false);
          return;
        }

        updateUser({
          variables: {
            id: userId, // ✅ matches $id in mutation
            input: {
              username: values.username,
              email: values.email,
              phoneNumber: values.phoneNumber,
            },
          },
        });

        setSubmitting(false);
      }}
    >
      {({ values, handleChange, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  name="username"
                  label="Username"
                  value={values.username}
                  onChange={handleChange}
                />
              </Grid>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  value={values.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  value={values.phoneNumber}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Customer"}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
