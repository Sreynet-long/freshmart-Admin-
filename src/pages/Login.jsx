import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { LOGIN_USER_FORM, FORGOT_PASSWORD } from "../schema/User";
import { useAuth } from "../Context/AuthContext";
import {
  Box, Button, TextField, Typography, Stack, Link, Alert,
  IconButton, InputAdornment, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [openForgot, setOpenForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  const [loginMutation, { loading }] = useMutation(LOGIN_USER_FORM, {
    onCompleted: (data) => {
      const userData = data?.loginUserForm?.data;
      if (userData) {
        login(userData.token, userData);
        alert(`Welcome ${userData.username}!`);
      }
    },
    onError: (err) => setLoginError(err.message),
  });

  const [forgotPassword, { loading: forgotLoading }] = useMutation(FORGOT_PASSWORD, {
    onCompleted: (data) => {
      setForgotMessage(data.forgotPassword.messageEn);
      setForgotError("");
    },
    onError: (err) => {
      setForgotError(err.message);
      setForgotMessage("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError("");
    loginMutation({ variables: { input: { email, password } } });
  };


  const handleForgotPassword = () => {
    if (!forgotEmail) return setForgotError("Please enter your email");
    forgotPassword({ variables: { email: forgotEmail } });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 10, p: 4, borderRadius: 2, boxShadow: 3, bgcolor: "background.paper" }}>
      <Stack spacing={2}>
        <Typography variant="h4" align="center">Fresh Mart Admin</Typography>
        <Typography variant="h6" align="center" color="text.secondary">Login to CMS</Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button type="submit"  variant="contained" color="primary" fullWidth disabled={loading} startIcon={loading && <CircularProgress size={20} />}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Link href="#" underline="hover" sx={{ textAlign: "center" }} onClick={(e) => { e.preventDefault(); setOpenForgot(true); }}>
              Forgot Password?
            </Link>
          </Stack>
        </form>

        {loginError && <Alert severity="error">{loginError}</Alert>}
      </Stack>

      {/* <Dialog open={openForgot} onClose={() => setOpenForgot(false)}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <TextField label="Email" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} fullWidth margin="dense" />
          {forgotMessage && <Alert severity="success" sx={{ mt: 1 }}>{forgotMessage}</Alert>}
          {forgotError && <Alert severity="error" sx={{ mt: 1 }}>{forgotError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForgot(false)}>Cancel</Button>
          <Button onClick={handleForgotPassword} disabled={forgotLoading}>
            {forgotLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
};

export default Login;
