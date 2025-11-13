"use client";
import React, { useState } from "react";
import {
  Drawer,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Fade,
  Slide,
  Stack,
  Tooltip,
  IconButton,
  Divider,
} from "@mui/material";
import { useMutation } from "@apollo/client/react";
import { CREATE_PRODUCT } from "../../schema/Product";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import CropImageFile from "../UploadImage/CropImageFile";
import LoadingProgess from "../UploadImage/LoadingProgress";
import EmptyImage from "../../assets/Image/empty-image.png";
import useSingleImageUpload from "../Hook/useSingleImageUpload";
import { useAuth } from "../../Context/AuthContext";
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";

export default function CreateProduct({ open, close, setRefetch }) {
  const { user, setAlert } = useAuth();
  const [loading, setLoading] = useState(false);
  const upload = useSingleImageUpload({
    storage: "intern",
    folder: "sreynet",
  });

const categories = [
    "General Inquiry",
    "Order Issue (Provide Order #)",
    "Partnership Inquiry",
    "Feedback",
  ];

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    onCompleted: ({ createProduct }) => {
      if (createProduct.isSuccess) {
        setAlert(
          true,
          "Success",
          createProduct?.messageEn || "Product created successfully"
        );
        close();
        formik.resetForm();
        setRefetch();
      } else {
        setAlert(
          true,
          "Failed",
          createProduct?.messageEn || "Failed to create product"
        );
      }
    },
    onError: (error) => {
      setAlert(true, "Error", error?.message);
      console.error("GraphQL Error:", error);
      setLoading(false);
    },
  });

  // Form validation
  const validationSchema = Yup.object().shape({
    productName: Yup.string().required("Product name is required"),
    category: Yup.string().required("Please select a category"),
    price: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be positive")
      .required("Price is required"),
    desc: Yup.string().required("Description is required"),
    imageUrl: Yup.mixed().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      productName: "",
      imageUrl: "",
      category: "",
      price: "",
      desc: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const payload = {
        ...values,
        imageUrl: upload.profileHook || "",
        price: parseFloat(values.price),
      };
      console.log("Submitting payload:", payload);

      try {
        await createProduct({
          variables: {
            input: payload,
          },
        });
      } catch (err) {
        console.error("Failed to create product:", err);
      } finally {
        setLoading(false);
      }
    },
  });

  const { values, errors, touched, getFieldProps, handleSubmit, resetForm } =
    formik;

  const handleCloseAction = () => {
    close?.();
    upload.deleteCurrentImage?.();
    upload.reset();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 650 },
          borderRadius: { xs: 0, sm: "12px 0 0 12px" },
          overflow: "hidden",
          bgcolor: "background.paper",
          boxShadow: 4,
        },
      }}
  >
      <FormikProvider value={formik}>
        <form
          onSubmit={handleSubmit}
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          {/* <Slide in={open} direction="left" timeout={400}> */}
          <Box
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: "background.default",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" fontWeight="bold">
                  Create Contact
                </Typography>
                <IconButton onClick={handleCloseAction} sx={{ color: "red" }}>
                  <DoDisturbOnOutlinedIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>

            {/* Scrollable Content */}
            <Fade in={open} timeout={500}>
              <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={7}>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Contact Name"
                        {...getFieldProps("contactName")}
                        error={
                          touched.contactName && Boolean(errors.contactName)
                        }
                        helperText={touched.contactName && errors.contactName}
                      />

                      <TextField
                        select
                        fullWidth
                        label="Subject"
                        {...getFieldProps("subject")}
                        error={touched.subject && Boolean(errors.subject)}
                        helperText={touched.subject && errors.subject}
                      >
                        {subjects.map((sub) => (
                          <MenuItem key={sub} value={sub}>
                            {sub.replaceAll("_", " ")}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        {...getFieldProps("price")}
                        error={touched.price && Boolean(errors.price)}
                        helperText={touched.price && errors.price}
                        inputProps={{ min: 0, step: "0.01" }}
                      />

                      <TextField
                        fullWidth
                        label="Description"
                        multiline
                        minRows={4}
                        {...getFieldProps("desc")}
                        error={touched.desc && Boolean(errors.desc)}
                        helperText={touched.desc && errors.desc}
                      />
                    </Stack>
                  </Grid>
                </Grid>
                <Box sx={{ height: 80 }} /> {/* spacing before footer */}
              </Box>
            </Fade>

            {/* Footer */}
            <Box
              sx={{
                borderTop: "1px solid",
                borderColor: "divider",
                p: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button onClick={handleCloseAction} disabled={loading}>
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? <CircularProgress size={24} /> : "Create"}
              </Button>
            </Box>
          </Box>
          {/* </Slide> */}
        </form>
      </FormikProvider>
    </Drawer>
  );
}
 