import { Box } from "@mui/material";
import React from "react";

interface MapProps {
  percentage: number;
}

const baseHeight = 180;
export const Map: React.FC<MapProps> = ({ percentage }) => {
  const height = baseHeight * (percentage / 100);
  return (
    <Box
      sx={{
        marginTop: "16px",
        marginBottom: "16px",
        position: "relative",
        overflow: "hidden",
        width: `${baseHeight * 1.56}px`,
        height: `${baseHeight}px`,
      }}
    >
      <Box
        sx={{
          height: `${height}px`,
          paddingTop: `${baseHeight - height}px`,
          position: "relative",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <Box sx={{ height: "33%", backgroundColor: "#d91a1a" }} />
        <Box sx={{ height: "33%", backgroundColor: "#fff" }} />
        <Box sx={{ height: "33%", backgroundColor: "#1d9918" }} />
      </Box>
      <img
        src="../../public/hunmap.png"
        alt="map"
        style={{
          overflow: "hidden",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
    </Box>
  );
};
