"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Drawer,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Divider,
  Stack,
  IconButton,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { CloseSquare } from "iconsax-react";
import { useMutation, useQuery } from "@apollo/client/react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import CropImageFile from "../UploadImage/CropImageFile";
import LoadingProgess from "../UploadImage/LoadingProgress";
import EmptyImage from "../../assets/Image/empty-image.png";
import useSingleImageUpload from "../Hook/useSingleImageUpload";
import { useAuth } from "../../Context/AuthContext";
import { UPDATE_PRODUCT, GET_PRODUCT_BY_ID } from "../../schema/Product";
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";

export default function UpdateProduct({ open, close, product, setRefetch }) {
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadedNew, setUploadedNew] = useState(false);
  const productId = product?._id || product?.id;

  const upload = useSingleImageUpload({ storage: "intern", folder: "sreynet" });
  const initialImageRef = useRef("");

  // Fetch existing product
  const { data, loading: loadingProduct } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id: productId },
    skip: !productId,
  });

  useEffect(() => {
    if (data?.getProductById?.imageUrl) {
      initialImageRef.current = data.getProductById.imageUrl;
      upload.setProfileHook(initialImageRef.current);
      upload.setImageLink(initialImageRef.current);
      setUploadedNew(false);
    }
  }, [data]);

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    onCompleted: ({ updateProduct }) => {
      setLoading(false);
      if (updateProduct?.isSuccess) {
        setAlert(true, "success", updateProduct.message);
        if (typeof setRefetch === "function") setRefetch();
        handleClose();
      } else {
        setAlert(true, "error", updateProduct?.message);
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message);
    },
  });

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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      productName: data?.getProductById?.productName || "",
      category: data?.getProductById?.category || "",
      price: data?.getProductById?.price || "",
      // quantity: data?.getProductById?.quantity || "",
      desc: data?.getProductById?.desc || "",
      imageUrl: data?.getProductById?.imageUrl || "",
    },
    validationSchema: Yup.object({
      productName: Yup.string().required("Product name is required"),
      category: Yup.string().required("Please select a category"),
      price: Yup.number()
        .typeError("Price must be a number")
        .positive("Price must be positive")
        .required("Price is required"),
      // quantity: Yup.number()
      //   .typeError("Quantity must be a number")
      //   .required("Quantity is required"),
      desc: Yup.string(),
      imageUrl: Yup.mixed().nullable(),
    }),
    onSubmit: (values) => {
      setLoading(true);
      updateProduct({
        variables: {
          id: productId,
          input: {
            ...values,
            imageUrl: upload.profileHook || values.imageUrl,
          },
        },
      });
    },
  });

  const { values, errors, touched, getFieldProps, handleSubmit, resetForm } =
    formik;

  useEffect(() => {
    if (upload.profileHook && initialImageRef.current !== upload.profileHook) {
      setUploadedNew(true);
    }
  }, [upload.profileHook]);

  // Auto-preview when URL pasted
  useEffect(() => {
    if (upload.imageLink && upload.imageLink.startsWith("http")) {
      upload.setProfileHook(upload.imageLink);
    }
  }, [upload.imageLink]);

  const handleClose = () => {
    if (uploadedNew) upload.deleteCurrentImage?.();
    setUploadedNew(false);
    resetForm();
    close?.();
  };

  const displayImage =
    upload.previewUrl || upload.profileHook || values.imageUrl || EmptyImage;

  if (!product || loadingProduct) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
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
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Update Product</Typography>
              <IconButton onClick={handleClose} sx={{ color: "red" }}>
                <DoDisturbOnOutlinedIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
            <Grid container spacing={3}>
              {/* Image Section */}
              <Grid item xs={12} md={5}>
                <Stack spacing={2} alignItems="center">
                  {!upload.openCrop ? (
                    <Button component="label">
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={upload.handleFileInputChange}
                      />
                      <img
                        src={displayImage}
                        alt="product"
                        style={{
                          width: "210px",
                          height: "230px",
                          borderRadius: "12px",
                          objectFit: "cover",
                          border: "1px solid #ddd",
                          cursor: "pointer",
                        }}
                      />
                    </Button>
                  ) : (
                    <CropImageFile
                      openCrop={upload.openCrop}
                      setOpenCrop={upload.setOpenCrop}
                      photoURL={upload.photoURL}
                      setPhotoURL={upload.setPhotoURL}
                      setImageFile={upload.setImageFile}
                      setProfileHook={upload.setProfileHook}
                      setProgress={upload.setProgress}
                      setStatusProgress={upload.setStatusProgress}
                    />
                  )}

                  {upload.statusProgress && upload.progress < 100 && (
                    <LoadingProgess
                      progress={upload.progress}
                      setProgress={upload.setProgress}
                    />
                  )}

                  {/* Paste Image URL */}
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

              {/* Product Info */}
              <Grid item xs={12} md={7}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    {...getFieldProps("productName")}
                    error={touched.productName && Boolean(errors.productName)}
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
                  />
                  {/* <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    {...getFieldProps("quantity")}
                    error={touched.quantity && Boolean(errors.quantity)}
                    helperText={touched.quantity && errors.quantity}
                  /> */}
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
          </Box>

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
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </Box>
        </form>
      </FormikProvider>
    </Drawer>
  );
}
