import React, { createContext, useState, useContext } from "react";
import { useApolloClient } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { LOGIN_USER_FORM } from "../schema/User";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const client = useApolloClient();

  const login = async (email, password) => {
    // GraphQL mutation for login
    const { data } = await client.mutate({
      mutation: LOGIN_USER_FORM,
      variables: { email, password },
    });

    if (data?.loginUserForm?.token) {
      localStorage.setItem("token", data.loginUserForm.token);
      setToken(data.loginUserForm.token);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };
  // ====================Alert Message======================
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [messageAlert, setMessageAlert] = useState({
    messageKh: "",
    messageEn: "",
  });

  const setAlert = (open, alert, message) => {
    setOpen(open);
    setAlertStatus(alert);
    setMessageAlert(message);
  };

  const alert = () => {
    return { open: open, status: alertStatus, message: messageAlert };
  };

  const handleGetLanguage = () => {
    return window.localStorage.getItem("language") || "en";
  };

  // =================  change language =======================================
  const [language, setLanguage] = useState(handleGetLanguage());
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        alert,
        setAlert,
        changeLanguage,
        language,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
