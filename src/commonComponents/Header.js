import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // calls the AuthContext logout method which handles redirection and state reset
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Typography variant="h6">
            <strong>Employee Management System</strong>
          </Typography>
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
