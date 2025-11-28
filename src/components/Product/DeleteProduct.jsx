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
  CircularProgress,
} from "@mui/material";
import { useMutation } from "@apollo/client/react";
import { DELETE_PRODUCT } from "../../schema/Product";
import { useAuth } from "../../Context/AuthContext";
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";
import EmptyImage from "../../assets/Image/empty-image.png";

export default function DeleteProduct({
  productName,
  productId,
  imagePublicId,
  open,
  close,
  setRefetch,
  productImageUrl,
}) {
  const { setAlert } = useAuth();
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setConfirmText("");
  }, [open]);

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: ({ deleteProduct }) => {
      setLoading(false);
      if (deleteProduct?.isSuccess) {
        setAlert(
          true,
          "success",
          deleteProduct.messageEn || "Product deleted successfully"
        );
        setRefetch?.();
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
    const isConfirmed =
      confirmText.trim().toLowerCase() ===
      (productName || "").trim().toLowerCase();

    if (!isConfirmed) {
      setAlert(
        true,
        "error",
        "Please type the product name exactly to confirm."
      );
      return;
    }

    setLoading(true);

    console.log("Delete variables:", { _id: productId, imagePublicId });

    deleteProduct({
      variables: {
        _id: productId,
        imagePublicId,
      },
    });
  };

  const previewImg = productImageUrl || EmptyImage;
  const isConfirmed =
    confirmText.trim().toLowerCase() ===
    (productName || "").trim().toLowerCase();

  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 3, p: 2, position: "relative" } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight={700}>
            Delete Product
          </Typography>
          <IconButton onClick={close} color="error">
            <DoDisturbOnOutlinedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={2} alignItems="center">
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
          <Typography textAlign="center">
            Are you sure you want to delete{" "}
            <Typography component="span" fontWeight={600}>
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
            disabled={loading}
          />
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
              disabled={!isConfirmed || loading}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Delete"
              )}
            </Button>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
