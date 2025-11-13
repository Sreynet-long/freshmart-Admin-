import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import {
  Stack,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";

export default function CircularIndeterminate() {
  return (
    <TableBody bgcolor="white"  sx={{ height: "300px", borderRadius: "20px" }}>
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
                  <CircularProgress />
                </Box>
                <Typography>កំពុងដំណើរការ</Typography>
              </Stack>
            </Stack>
          </Box>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
