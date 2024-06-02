import createTheme from "@mui/material/styles/createTheme";

export const theme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#6b55a1",
      dark: "#2f2573",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});
