// import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// const Sidebar = () => {
//   const navigate = useNavigate();

//   return (
//     <Drawer variant="permanent" anchor="left">
//       <List>
//         <ListItemButton onClick={() => navigate("/employeeList")}>
//           <ListItemText primary="Employee List" />
//         </ListItemButton>
//         <ListItemButton onClick={() => navigate("/employeeform/add")}>
//           <ListItemText primary="Add Employee" />
//         </ListItemButton>
//       </List>
//     </Drawer>
//   );
// };

// export default Sidebar;

import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
        position: "absolute",
        left: 0,
        top: 0,
        height: "100%",
        zIndex: 1000,
        "& .MuiDrawer-paper": {
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: open ? 180 : 60,
          boxSizing: "border-box",
          transition: "width 0.3s ease",
          backgroundColor: "#1976d2", // MUI primary blue
          color: "#fff",
        },
      }}
    >
      <List>
        {navItems.map(({ label, icon, path }) => (
          <ListItem key={label} disablePadding>
            <ListItemButton
              onClick={() => navigate(path)}
              selected={location.pathname === path}
              sx={{
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                "&.Mui-selected": {
                  backgroundColor: "#1565c0",
                  "&:hover": { backgroundColor: "#0d47a1" },
                },
                "&:hover": { backgroundColor: "#2196f3" },
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
