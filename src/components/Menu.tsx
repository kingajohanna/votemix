import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Drawer from "@mui/material/Drawer";
import {
  PiNumberNineBold,
  PiNumberOneBold,
  PiNumberTwoBold,
} from "react-icons/pi";
import { IoIosPerson } from "react-icons/io";
import { GiEuropeanFlag } from "react-icons/gi";
import { HiHome } from "react-icons/hi";
import { IoLogOutOutline } from "react-icons/io5";

const tabs = [
  { label: "Kezdőlap", path: "/welcome", icon: <HiHome /> },
  {
    label: "EP választás",
    path: "/european-parliament",
    icon: <GiEuropeanFlag />,
  },
  {
    label: "Fővárosi közgyűlési lista",
    path: "/budapest-list",
    icon: <IoIosPerson />,
  },
  { label: "Főpolgármester választás", path: "/mayor", icon: <IoIosPerson /> },
  {
    label: "12. kerület",
    path: "/12-district",
    icon: (
      <>
        <PiNumberOneBold /> <PiNumberTwoBold />
      </>
    ),
  },
  { label: "9. kerület", path: "/9-district", icon: <PiNumberNineBold /> },
];

export const Menu = ({ children, title }: any) => {
  const [username, setUsername] = useLocalStorage("username");
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const onLogout = () => {
    setUsername("");
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            {username && (
              <IoLogOutOutline
                size={32}
                onClick={onLogout}
                style={{ cursor: "pointer" }}
              />
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer open={open} role="presentation" onClose={handleDrawerClose}>
        <List>
          {tabs.map((tab) => (
            <ListItem
              key={tab.label}
              disablePadding
              onClick={() => navigate(tab.path)}
            >
              <ListItemButton>
                <ListItemText primary={tab.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      {children}
    </Box>
  );
};
