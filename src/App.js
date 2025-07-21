import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import EmployeeList from "./pages/EmployeeList";
import EmployeeForm from "./pages/EmployeeForm";
import ProtectedRoute from "./components/ProtectedRote";
import Header from "./commonComponents/Header";
import Sidebar from "./commonComponents/Sidebar";
import { Box } from "@mui/material";

// Layout constants
const SIDEBAR_COLLAPSED_WIDTH = 60;
const SIDEBAR_EXPANDED_WIDTH = 180;
const HEADER_HEIGHT = 14;

// Wrapper to include header & sidebar only if logged in
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [open, setOpen] = useState(false);

  // If not logged in, don't show layout components (header/sidebar)
  if (!isLoggedIn) {
    return children;
  }

  return (
    <>
      <Header />
      <Box sx={{ display: "flex" }}>
        <Sidebar open={open} setOpen={setOpen} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: `${HEADER_HEIGHT}px`,
            ml: open
              ? `${SIDEBAR_EXPANDED_WIDTH}px`
              : `${SIDEBAR_COLLAPSED_WIDTH}px`,
            transition: "margin-left 0.3s ease",
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/employeelist" /> : <LoginPage />
            }
          />
          <Route
            path="/employeelist"
            element={
              <ProtectedRoute>
                <EmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employeeform/add"
            element={
              <ProtectedRoute>
                <EmployeeForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employeeform/edit/:id"
            element={
              <ProtectedRoute>
                <EmployeeForm />
              </ProtectedRoute>
            }
          />
          {/* Catch all unknown paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}

export default App;
