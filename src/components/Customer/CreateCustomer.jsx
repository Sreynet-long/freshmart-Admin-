import React, { useState } from "react";
import {
  Drawer,
  Stack,
  Box,
  Typography,
  TextField,
  IconButton,
  Grid,
  Button,
  useMediaQuery,
  Fade,
  Divider,
} from "@mui/material";
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";


export default function CreateCustomer({ open, setOpen, setRefetch }) {
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const isMobile = useMediaQuery("(max-width:600px)");

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Creating customer:", customer); // replace with CREATE_USER mutation
    setOpen(false);
    setCustomer({ name: "", email: "", phone: "" });
    setRefetch?.();
  };

  const handleClose = () => {
    setOpen(false);
    setCustomer({ name: "", email: "", phone: "" });
  };

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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
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
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography variant="h6" fontWeight={700}>
              Create Customer
            </Typography>
            <IconButton onClick={handleClose} sx={{ color: "red" }}>
              <DoDisturbOnOutlinedIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Divider/>
          {/* Content */}
          <Fade in={open} timeout={500}>
            <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={2}>
                    <TextField
                      label="Name"
                      name="name"
                      value={customer.name}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Email"
                      name="email"
                      value={customer.email}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      label="Phone"
                      name="phone"
                      value={customer.phone}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Fade>

          {/* Footer */}
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" type="submit">
              Save
            </Button>
          </Box>
        </Box>
      </form>
    </Drawer>
  );
}
