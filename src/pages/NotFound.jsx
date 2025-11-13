import React from "react";
import { Typography } from "@mui/material";
import "../styles/notFound.css"; 

export default function NotFound() {
  return (
    <div className="container-notFound">
      <Typography className="text-404">404 - Page Not Found</Typography>
    </div>
  );
}
