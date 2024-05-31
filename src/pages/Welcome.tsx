import { Box } from "@mui/material";
import Countdown from "../components/Countdown";
import { Menu } from "../components/Menu";
import { Participate } from "../components/Participate";

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
        <Countdown />

        <Participate />
      </Box>
    </Menu>
  );
};
