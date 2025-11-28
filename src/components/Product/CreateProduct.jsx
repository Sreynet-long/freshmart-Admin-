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
  const { setAlert } = useAuth();
  const [loading, setLoading] = useState(false);

  // image upload hook
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

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    onCompleted: ({ createProduct }) => {
      setLoading(false);

      if (createProduct.isSuccess) {
        setAlert(true, "Success", createProduct.messageEn);
        formik.resetForm();
        upload.reset();
        close();
        setRefetch?.();
      } else {
        setAlert(true, "Failed", createProduct.messageEn);
      }
    },
    onError: (err) => {
      setLoading(false);
      setAlert(true, "Error", err.message);
    },

    update: (cache, { data }) => {
      if (!data?.createProduct?.product) return;

      cache.modify({
        fields: {
          getAllproducts(existingProducts = []) {
            return [...existingProducts, data.createProduct.product];
          },
        },
      });
    },
  });

  // Yup validation
  const validationSchema = Yup.object().shape({
    productName: Yup.string().required("Product name is required"),
    category: Yup.string().required("Please select a category"),
    price: Yup.number()
      .typeError("Price must be a number")
      .positive()
      .required(),
    desc: Yup.string().nullable(),
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      productName: "",
      imageUrl: "",
      imagePublicId: "",
      category: "",
      price: "",
      desc: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (upload.openCrop) {
        setAlert(true, "Warning", "Please finish cropping the image first.");
        return;
      }

      if (upload.progress > 0 && upload.progress < 100) {
        setAlert(true, "Warning", "Image upload is still in progress.");
        return;
      }

      // ✅ Require at least one image source
      if (!upload.profileHook && !upload.imageLink) {
        setAlert(true, "Warning", "Please upload an image or paste a link.");
        return;
      }

      setLoading(true);

      const payload = {
        productName: values.productName,
        category: values.category,
        price: parseFloat(values.price),
        desc: values.desc || null,
        imageUrl: upload.profileHook || upload.imageLink,   // ✅ guaranteed non-null
        imagePublicId: upload.imagePublicId || null,        // ✅ null if link
      };

      console.log("Payload being sent:", payload);
      await createProduct({ variables: { input: payload } });
    }

  });

  const { values, errors, touched, getFieldProps, handleSubmit } = formik;

  const handleCloseAction = () => {
    close?.();
    formik.resetForm();
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
                Create Product
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
                {/* Product Image */}
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
                          src={upload.previewUrl || EmptyImage}
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

                    {/* Upload progress */}
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

                {/* Product Details */}
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
              {loading ? <CircularProgress size={24} /> : "Create"}
            </Button>
          </Box>
        </form>
      </FormikProvider>
    </Drawer>
  );
}
