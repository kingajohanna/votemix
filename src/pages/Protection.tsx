import { Box, Button, TextField, Typography } from "@mui/material";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

export const Protection = () => {
  const [_, setAuthenticated] = useLocalStorage("authenticated");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(import.meta.env.VITE_PASSWORD);

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
