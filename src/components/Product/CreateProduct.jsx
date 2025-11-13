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

  // Product categories
  const categories = [
    "Vegetable",
    "Sneack_and_Bread",
    "Fruit",
    "Meats",
    "Milk_and_Diary",
    "Seafood",
    "Drinks",
    "Frozen_Food",
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
                  Create Product
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
                  {/* Image */}
                  <Grid item xs={12} md={5}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      gutterBottom
                      sx={{ mb: 1 }}
                    >
                      Product Image
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={2} alignItems="center">
                      {!upload.openCrop ? (
                        <Box sx={{ width: "100%", textAlign: "center" }}>
                          <Tooltip title="Click to upload">
                            <Button
                              component="label"
                              sx={{ display: "block", width: "100%" }}
                            >
                              <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={upload.handleFileInputChange}
                              />
                              <img
                                src={upload.previewUrl || EmptyImage}
                                alt="product"
                                style={{
                                  width: "210px",
                                  height: "230px",
                                  borderRadius: "12px",
                                  objectFit: "cover",
                                  border: "1px solid #ddd",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                  cursor: "pointer",
                                }}
                              />
                            </Button>
                          </Tooltip>
                        </Box>
                      ) : (
                        <CropImageFile
                          setProgress={upload.setProgress}
                          setStatusProgress={upload.setStatusProgress}
                          openCrop={upload.openCrop}
                          setOpenCrop={upload.setOpenCrop}
                          photoURL={upload.photoURL}
                          setPhotoURL={upload.setPhotoURL}
                          setImageFile={upload.setImageFile}
                          setProfileHook={upload.setProfileHook}
                        />
                      )}

                      {upload.statusProgress && upload.progress < 100 ? (
                        <LoadingProgess
                          progress={upload.progress}
                          setProgress={upload.setProgress}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textAlign: "center" }}
                        >
                          Click image to upload or paste a link below
                        </Typography>
                      )}

                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        label="Or paste image URL"
                        placeholder="https://example.com/image.jpg"
                        value={upload.imageLink}
                        onChange={(e) => upload.setImageLink(e.target.value)}
                      />
                    </Stack>
                  </Grid>

                  {/* Product Details */}
                  <Grid item xs={12} md={7}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      gutterBottom
                      sx={{ mb: 1 }}
                    >
                      Product Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Product Name"
                        {...getFieldProps("productName")}
                        error={
                          touched.productName && Boolean(errors.productName)
                        }
                        helperText={touched.productName && errors.productName}
                      />

                      <TextField
                        select
                        fullWidth
                        label="Category"
                        {...getFieldProps("category")}
                        error={touched.category && Boolean(errors.category)}
                        helperText={touched.category && errors.category}
                      >
                        {categories.map((cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat.replaceAll("_", " ")}
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
