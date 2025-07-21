// import { AppBar, Toolbar, Typography, Box } from "@mui/material";

// const Header = () => {
//   return (
//     <AppBar position="static">
//       <Toolbar>
//         <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
//           <Typography variant="h6" component="div">
//             Employee Management System
//           </Typography>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;

import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Typography variant="h6">Employee Management System</Typography>
        </Box>
        <Box sx={{ position: "absolute", right: 20 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{
              "&:hover": {
                backgroundColor: "#b71c1c", // darker red on hover
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
