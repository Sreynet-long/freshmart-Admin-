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
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import { useMutation } from "@apollo/client/react";
import { UPDATE_PRODUCT } from "../../schema/Product";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

import CropImageFile from "../UploadImage/CropImageFile";
import LoadingProgess from "../UploadImage/LoadingProgress";
import EmptyImage from "../../assets/Image/empty-image.png";
import useSingleImageUpload from "../Hook/useSingleImageUpload";
import { useAuth } from "../../Context/AuthContext";
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";

export default function UpdateProduct({ open, close, setRefetch, product }) {
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);

  const upload = useSingleImageUpload({
    storage: "cloudinary",
    folder: "products",
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

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    onCompleted: ({ updateProduct }) => {
      setLoading(false);
      if (updateProduct?.isSuccess) {
        setAlert(
          true,
          "success",
          updateProduct.messageEn || "Product updated successfully"
        );
        formik.resetForm();
        upload.reset();
        close();
        setRefetch?.();
      } else {
        setAlert(true, "error", updateProduct?.messageEn || "Update failed");
      }
    },
    onError: (err) => {
      setLoading(false);
      setAlert(true, "error", err.message || "Something went wrong");
    },
  });

  const validationSchema = Yup.object().shape({
    productName: Yup.string().trim().required("Product name is required"),
    category: Yup.string().required("Please select a category"),
    price: Yup.number()
      .typeError("Price must be a number")
      .positive()
      .required("Price is required"),
    desc: Yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      productName: product?.productName || "",
      imageUrl: product?.imageUrl || "",
      imagePublicId: product?.imagePublicId || "",
      category: product?.category || "",
      price: product?.price || "",
      desc: product?.desc || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (upload.openCrop) {
        setAlert(true, "warning", "Please finish cropping the image first.");
        return;
      }
      if (upload.progress > 0 && upload.progress < 100) {
        setAlert(true, "warning", "Image upload is still in progress.");
        return;
      }

      setLoading(true);

      // Always send either new or old imageUrl + imagePublicId
      const payload = {
        productName: values.productName,
        category: values.category,
        price: parseFloat(values.price),
        desc: values.desc || null,
        imageUrl: upload.profileHook || upload.imageLink || product.imageUrl,
        imagePublicId:
          upload.imagePublicId !== undefined &&
          upload.imagePublicId !== null &&
          upload.imagePublicId !== ""
            ? upload.imagePublicId
            : product.imagePublicId || null,
      };

      console.log("Update payload:", payload);

      await updateProduct({
        variables: {
          _id: product.id,
          input: payload,
        },
      });
    },
  });

  const { errors, touched, getFieldProps, handleSubmit } = formik;

  const handleCloseAction = () => {
    formik.resetForm();
    upload.reset();
    close?.();
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
        },
      }}
    >
      <FormikProvider value={formik}>
        <form
          onSubmit={handleSubmit}
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
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
                Update Product
              </Typography>
              <IconButton onClick={handleCloseAction} sx={{ color: "red" }}>
                <DoDisturbOnOutlinedIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          {/* Content */}
          <Fade in={open} timeout={500}>
            <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
              <Grid container spacing={3}>
                {/* Image */}
                <Grid item xs={12} md={5}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Product Image
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Stack spacing={2} alignItems="center">
                    {!upload.openCrop ? (
                      <Button component="label" sx={{ width: "100%" }}>
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={upload.handleFileInputChange}
                        />
                        <img
                          src={
                            upload.previewUrl || product.imageUrl || EmptyImage
                          }
                          alt="product"
                          style={{
                            width: "210px",
                            height: "230px",
                            borderRadius: 12,
                            objectFit: "cover",
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            cursor: "pointer",
                          }}
                        />
                      </Button>
                    ) : (
                      <CropImageFile
                        uploadImage={upload.uploadToServer}
                        setProgress={upload.setProgress}
                        setStatusProgress={upload.setStatusProgress}
                        openCrop={upload.openCrop}
                        setOpenCrop={upload.setOpenCrop}
                        photoURL={upload.photoURL}
                        setPhotoURL={upload.setPhotoURL}
                        setImageFile={upload.setImageFile}
                        setProfileHook={upload.setProfileHook}
                        setImagePublicId={upload.setImagePublicId}
                      />
                    )}
                    {upload.statusProgress && upload.progress < 100 && (
                      <LoadingProgess
                        progress={upload.progress}
                        setProgress={upload.setProgress}
                      />
                    )}
                    <TextField
                      fullWidth
                      size="small"
                      label="Or paste image URL"
                      value={upload.imageLink}
                      onChange={(e) => upload.setImageLink(e.target.value)}
                    />
                  </Stack>
                </Grid>

                {/* Details */}
                <Grid item xs={12} md={7}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Product Details
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Stack spacing={2}>
                    <TextField
                      label="Product Name"
                      {...getFieldProps("productName")}
                      error={touched.productName && Boolean(errors.productName)}
                      helperText={touched.productName && errors.productName}
                    />
                    <TextField
                      select
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
                      label="Price"
                      type="number"
                      {...getFieldProps("price")}
                      error={touched.price && Boolean(errors.price)}
                      helperText={touched.price && errors.price}
                      inputProps={{ min: 0, step: "0.01" }}
                    />
                    <TextField
                      label="Description"
                      multiline
                      minRows={4}
                      {...getFieldProps("desc")}
                    />
                  </Stack>
                </Grid>
              </Grid>
              <Box sx={{ height: 70 }} />
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
              sx={{ minWidth: 130 }}
              disabled={
                loading || (upload.progress > 0 && upload.progress < 100)
              }
            >
              {loading ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </Box>
        </form>
      </FormikProvider>
    </Drawer>
  );
}
