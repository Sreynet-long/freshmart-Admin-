import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import RouterComponent from "./routes";
import AlertMessage from "./components/AlertMessage/AlertMessage";

function App() {
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: { background: { default: "#f8f8f8" } },
        typography: { fontFamily: "'Noto Sans Khmer', sans-serif" },
      }),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <RouterComponent />
      </BrowserRouter>
      <CssBaseline />
      <AlertMessage />
    </ThemeProvider>
  );
}

export default App;
