import { Box, Button, TextField, Typography } from "@mui/material";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Protection = () => {
  const [authenticated, setAuthenticated] = useLocalStorage("authenticated");
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      navigate("/login", { replace: true });
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (data.get("password") === import.meta.env.VITE_PASSWORD) {
      setAuthenticated(true);
      navigate("/login", { replace: true });
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      }}
      component="form"
      onSubmit={handleSubmit}
      noValidate
    >
      <Typography variant="h5">Enter game using password</Typography>

      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        sx={{ width: "300px" }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ width: "300px" }}
      >
        Play
      </Button>
    </Box>
  );
};
