import React from "react";
import emptybox from "../../assets/Image/empty-box.png";
import {
  Box,
  TableBody,
  TableCell,
  TableRow,
  Stack,
  Typography,
} from "@mui/material";
const EmptyData = () => {
  return (
    <TableBody bgcolor="white" sx={{ height: "300px", borderRadius: "20px" }}>
      <TableRow>
        <TableCell colSpan={10} align="center">
          <Box bgcolor="white">
            <Stack
              direction="row"
              justifyContent="center"
              sx={{ width: "100%" }}
            >
              <Stack
                direction="column"
                textAlign="center"
                sx={{ width: "100%" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    height: "100px",
                    width: "100%",
                  }}
                >
                  <img
                    className="box-image"
                    src={emptybox}
                    alt={emptybox}
                    style={{ width: "80px", height: "80px" }}
                  />
                </Box>
                <Typography>Data Empty</Typography>
              </Stack>
            </Stack>
          </Box>
        </TableCell>
      </TableRow>
    </TableBody>
  );
};

export default EmptyData;
