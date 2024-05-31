import { Box, Typography } from "@mui/material";
import Countdown from "../components/Countdown";
import { Menu } from "../components/Menu";

export const Welcome = () => {
  return (
    <Menu title="Kezdőlap">
      <Box
        sx={{
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="body1" gutterBottom>
          A választásokig hátralévő idő:
        </Typography>
        <Countdown />
      </Box>
    </Menu>
  );
};
