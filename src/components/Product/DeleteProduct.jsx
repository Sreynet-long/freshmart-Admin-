"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Divider,
  Button,
  IconButton,
  Stack,
  TextField,
  Box,
} from "@mui/material";
import { useMutation } from "@apollo/client/react";
import { DELETE_PRODUCT } from "../../schema/Product";
import { useAuth } from "../../Context/AuthContext";
import useSingleImageUpload from "../Hook/useSingleImageUpload";
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";
import EmptyImage from "../../assets/Image/empty-image.png";

export default function DeleteProduct({
  productName,
  productId,
  open,
  close,
  setRefetch,
  productImageUrl,
}) {
  const { setAlert } = useAuth();
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const upload = useSingleImageUpload({
    storage: "intern",
    folder: "sreynet",
  });

  // Reset confirm text and set preview image when dialog opens
  useEffect(() => {
    if (open) {
      setConfirmText("");
      upload.reset();
      if (productImageUrl) upload.setProfileHook(productImageUrl);
    }
  }, [open, productImageUrl]);

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: ({ deleteProduct }) => {
      setLoading(false);
      if (deleteProduct?.isSuccess) {
        if (productImageUrl) upload.deleteCurrentImage();
        upload.reset();
        setAlert(
          true,
          "success",
          deleteProduct.messageEn || "Product deleted successfully"
        );
        if (typeof setRefetch === "function") setRefetch();
        close();
      } else {
        setAlert(true, "error", deleteProduct.messageEn || "Delete failed");
      }
    },
    onError: (error) => {
      setLoading(false);
      setAlert(true, "error", error.message || "Something went wrong");
    },
  });

  const handleDelete = () => {
    if ((confirmText || "").trim() !== (productName || "").trim()) {
      setAlert(true, "error", "Please type the product name exactly to confirm.");
      return;
    }

    setLoading(true);
    deleteProduct({ variables: { id: productId } });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && confirmText === productName && !loading) {
      handleDelete();
    }
  };

  const previewImg =
    upload.previewUrl || upload.profileHook || productImageUrl || EmptyImage;

  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
          position: "relative",
        },
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            Delete Product
          </Typography>
          <IconButton onClick={close} color="error">
            <DoDisturbOnOutlinedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent>
        <Stack spacing={2} alignItems="center">
          {/* Image Preview */}
          <Box
            component="img"
            src={previewImg}
            alt="Product Preview"
            sx={{
              width: 150,
              height: 150,
              borderRadius: 3,
              objectFit: "cover",
              boxShadow: 2,
              mb: 1,
            }}
          />

          <Typography textAlign="center" sx={{ mt: 1 }}>
            Are you sure you want to delete this product:
            <Typography component="span" fontWeight={600}>
              {" "}
              {productName}
            </Typography>
            ?
          </Typography>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Please type the product name below to confirm deletion.
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="Enter product name"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />

          {/* Buttons */}
          <Box display="flex" gap={1} mt={1} width="100%">
            <Button
              variant="outlined"
              fullWidth
              onClick={close}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={handleDelete}
              disabled={
                loading ||
                confirmText.trim() !== productName.trim() ||
                !productName
                
              }
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
