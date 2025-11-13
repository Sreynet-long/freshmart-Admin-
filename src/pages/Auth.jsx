// src/pages/Auth.jsx
import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  LOGIN_USER_FORM,
  SIGN_UP_USER_FORM,
  GET_USER_WITH_PAGINATION,
  FORGOT_PASSWORD,
} from "../schema/User";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  useMediaQuery,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CheckCircleOutline,
} from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useTheme } from "@mui/material/styles";

// Password field component
const PasswordField = ({
  field,
  form,
  label,
  showPassword,
  toggleShowPassword,
}) => (
  <TextField
    {...field}
    type={showPassword ? "text" : "password"}
    label={label}
    fullWidth
    error={Boolean(form.touched[field.name] && form.errors[field.name])}
    helperText={form.touched[field.name] && form.errors[field.name]}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={toggleShowPassword} edge="end">
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);

const Auth = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [showSignup, setShowSignup] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] =
    useState(false);
  const [showSignupSuccess, setShowSignupSuccess] = useState(false);

  const [openForgotDialog, setOpenForgotDialog] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotRequestSuccess, setForgotRequestSuccess] = useState("");
  const [forgotRequestError, setForgotRequestError] = useState("");

  const { data: userData, loading: userLoading } = useQuery(
    GET_USER_WITH_PAGINATION,
    {
      variables: { page: 1, limit: 1 },
    }
  );

  useEffect(() => {
    if (userData?.getUserWithPagination?.data?.length > 0) setShowSignup(false);
    else setShowSignup(true);
  }, [userData]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard", { replace: true });
  }, [navigate]);

  const [loginUserForm, { loading: loginLoading }] = useMutation(
    LOGIN_USER_FORM,
    {
      onCompleted: (data) => {
        const userData = data?.loginUserForm?.data;
        if (userData) {
          login(userData.token, userData);
          navigate("/dashboard", { replace: true });
        }
      },
      onError: (error) => console.error(error.message),
    }
  );

  const [signupMutation, { loading: signupLoading }] = useMutation(
    SIGN_UP_USER_FORM,
    {
      onCompleted: (data) => {
        const res = data?.signupUserForm;
        if (res?.isSuccess) {
          setShowSignupSuccess(true);
          setTimeout(() => {
            setShowSignup(false);
            setShowSignupSuccess(false);
          }, 2500);
        } else {
          setSnackbar({
            open: true,
            severity: "error",
            message: res?.messageEn.includes("already registered")
              ? "This email is already registered."
              : res?.messageEn,
          });

          const emailInput = document.querySelector('input[name="email"]');
          if (emailInput) emailInput.focus();
        }
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          severity: "error",
          message: error.message,
        });
      },
    }
  );

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const [forgotPasswordMutation, { loading: forgotLoading }] = useMutation(
    FORGOT_PASSWORD,
    {
      onCompleted: (data) => {
        const res = data.forgotPassword;
        if (res?.isSuccess) {
          setForgotRequestSuccess(res.messageEn);
          setForgotRequestError("");
        } else {
          setForgotRequestError(
            res?.messageEn || "Failed to send reset instructions"
          );
          setForgotRequestSuccess("");
        }
      },
      onError: (err) => {
        setForgotRequestError(err.message);
        setForgotRequestSuccess("");
      },
    }
  );

  const loginSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const signupSchema = Yup.object({
    username: Yup.string()
      .min(3, "Full Name too short")
      .required("Full Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "At least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  if (userLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        minHeight: "100vh",
      }}
    >
      {/* Left Branding */}
      {!isMobile && (
        <Box
          sx={{
            flex: 1,
            background: "linear-gradient(to bottom right, #4caf50, #81c784)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 6,
            textAlign: "center",
          }}
        >
          <img
            src="/freshmart-img.png"
            alt="Freshmart icon"
            style={{ width: 150, marginBottom: 20 }}
          />
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
            FreshMart CMS
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 350 }}>
            Manage your store efficiently and securely.
          </Typography>
        </Box>
      )}
      {/* Right Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          bgcolor: isMobile ? "#f5f7fa" : "inherit",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: isMobile ? "100%" : 400,
            borderRadius: 4,
            p: 4,
            boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
            position: "relative",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >
            {showSignup ? "Create Admin Account" : "Admin Login"}
          </Typography>

          {/* Signup / Login Forms */}
          <Box sx={{ mt: 2 }}>
            <Fade in={showSignup} mountOnEnter unmountOnExit>
              <Box sx={{ pointerEvents: showSignup ? "auto" : "none" }}>
                <Formik
                  initialValues={{
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    role: "Admin",
                  }}
                  validationSchema={signupSchema}
                  onSubmit={(values) =>
                    signupMutation({
                      variables: {
                        input: {
                          username: values.username,
                          email: values.email,
                          password: values.password,
                          role: "Admin",
                        },
                      },
                    })
                  }
                >
                  {({
                    errors,
                    touched,
                    handleChange,
                    values,
                    isValid,
                    dirty,
                  }) => (
                    <Form>
                      <Stack spacing={2}>
                        <TextField
                          label="Full Name"
                          name="username"
                          value={values.username}
                          onChange={handleChange}
                          error={touched.username && Boolean(errors.username)}
                          helperText={touched.username && errors.username}
                        />
                        <TextField
                          label="Email"
                          name="email"
                          type="email"
                          value={values.email}
                          onChange={handleChange}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                        />
                        <Field
                          name="password"
                          label="Password"
                          showPassword={showSignupPassword}
                          toggleShowPassword={() =>
                            setShowSignupPassword(!showSignupPassword)
                          }
                          component={PasswordField}
                        />
                        <Field
                          name="confirmPassword"
                          label="Confirm Password"
                          showPassword={showSignupConfirmPassword}
                          toggleShowPassword={() =>
                            setShowSignupConfirmPassword(
                              !showSignupConfirmPassword
                            )
                          }
                          component={PasswordField}
                        />
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          sx={{
                            background:
                              "linear-gradient(to right, #4caf50, #81c784)",
                            color: "#fff",
                            "&:hover": {
                              background:
                                "linear-gradient(to right, #388e3c, #66bb6a)",
                            },
                          }}
                          disabled={!isValid || !dirty || signupLoading}
                        >
                          {signupLoading ? (
                            <CircularProgress size={20} />
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                        <Typography
                          variant="body2"
                          textAlign="center"
                          sx={{ mt: 1, color: "#000000ff" }}
                          onClick={() => setShowSignup(false)}
                        >
                          Already have an account?{" "}
                          <span
                            style={{ color: "#339436ff", cursor: "pointer" }}
                          >
                            Login
                          </span>
                        </Typography>
                      </Stack>
                    </Form>
                  )}
                </Formik>
              </Box>
            </Fade>

            <Fade in={!showSignup} mountOnEnter unmountOnExit>
              <Box sx={{ pointerEvents: !showSignup ? "auto" : "none" }}>
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validationSchema={loginSchema}
                  onSubmit={(values) =>
                    loginUserForm({ variables: { input: values } })
                  }
                >
                  {({
                    errors,
                    touched,
                    handleChange,
                    values,
                    isValid,
                    dirty,
                  }) => (
                    <Form>
                      <Stack spacing={2}>
                        <TextField
                          label="Email"
                          name="email"
                          type="email"
                          value={values.email}
                          onChange={handleChange}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                        />
                        <Field
                          name="password"
                          label="Password"
                          showPassword={showLoginPassword}
                          toggleShowPassword={() =>
                            setShowLoginPassword(!showLoginPassword)
                          }
                          component={PasswordField}
                        />
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          sx={{
                            background:
                              "linear-gradient(to right, #4caf50, #81c784)",
                            color: "#fff",
                            "&:hover": {
                              background:
                                "linear-gradient(to right, #388e3c, #66bb6a)",
                            },
                          }}
                          disabled={!isValid || !dirty || loginLoading}
                        >
                          {loginLoading ? (
                            <CircularProgress size={20} />
                          ) : (
                            "Login"
                          )}
                        </Button>
                        {/* <Typography
                          variant="body2"
                          textAlign="center"
                          sx={{ mt: 1, cursor: "pointer", color: "gray" }}
                          onClick={() => setOpenForgotDialog(true)}
                        >
                          Forgot password?
                        </Typography> */}
                        <Typography
                          variant="body2"
                          textAlign="center"
                          sx={{ mt: 1, color: "#000000ff" }}
                          onClick={() => setShowSignup(true)}
                        >
                          Don't have an account?
                          <span
                            style={{ color: "#339436ff", cursor: "pointer" }}
                          >
                            Sign Up
                          </span>
                        </Typography>
                      </Stack>
                    </Form>
                  )}
                </Formik>
              </Box>
            </Fade>

            {/* Signup success */}
            {showSignupSuccess && (
              <Fade in timeout={400}>
                <Stack alignItems="center" spacing={2} mt={3}>
                  <CheckCircleOutline color="success" sx={{ fontSize: 60 }} />
                  <Typography variant="h6" color="green" fontWeight="bold">
                    Admin created successfully!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Redirecting to login...
                  </Typography>
                </Stack>
              </Fade>
            )}
          </Box>
        </Paper>
      </Box>
      {/* Forgot Password Dialog */}
      <Dialog
        open={openForgotDialog}
        onClose={() => setOpenForgotDialog(false)}
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            sx={{ mt: 1 }}
          />
          {forgotRequestSuccess && (
            <Alert severity="success" sx={{ mt: 1 }}>
              {forgotRequestSuccess}
            </Alert>
          )}
          {forgotRequestError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {forgotRequestError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForgotDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={forgotLoading || !forgotEmail}
            onClick={() => {
              setForgotRequestSuccess("");
              setForgotRequestError("");
              forgotPasswordMutation({ variables: { email: forgotEmail } });
            }}
          >
            {forgotLoading ? <CircularProgress size={18} /> : "Send Reset Link"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      ;
    </Box>
  );
};

export default Auth;
