import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);

  const navItems = [
    {
      label: "Employee List",
      icon: <PeopleIcon />,
      path: "/employeeList",
    },
    {
      label: "Add Employee",
      icon: <PersonAddIcon />,
      path: "/employeeform/add",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        // height: "100vh",
        mt: "64px",
        width: open ? 180 : 60,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          // height: "100vh",
          mt: "64px",
          width: open ? 180 : 60,
          boxSizing: "border-box",
          transition: "width 0.3s ease",
          backgroundColor: "#FF9F40",
          color: "#fff",
        },
      }}
    >
      <List>
        {navItems.map(({ label, icon, path }) => (
          <ListItem key={label} disablePadding>
            <ListItemButton
              onClick={() => navigate(path)}
              sx={{
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                "&:hover": {
                  backgroundColor: "#FFD580",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : "auto",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                {icon}
              </ListItemIcon>
              {open && <ListItemText primary={label} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
