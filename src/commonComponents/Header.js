import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        backgroundColor: "#E8EDF2",
        color: "#0D141C",
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Typography variant="h6" sx={{ color: "#0D141C" }}>
            <strong>Employee Management System</strong>
          </Typography>
        </Box>
        <Box sx={{ position: "absolute", right: 20 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{
              color: "#0D141C",
              backgroundColor: "rgba(247, 244, 244, 1)",
              "&:hover": {
                backgroundColor: "rgba(255, 0,0, 0.05)",
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
