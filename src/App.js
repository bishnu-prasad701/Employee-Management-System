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
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./commonComponents/Header";
import Sidebar from "./commonComponents/Sidebar";
import { Box } from "@mui/material";
import { useAuth } from "./context/AuthContext";

// Wrapper to include header & sidebar only if logged in
const LayoutWrapper = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);

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
            mt: 3,
            ml: `${open ? 20 : 20}px`,
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
  const { isLoggedIn } = useAuth();

  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/employeeList" /> : <LoginPage />
            }
          />
          <Route
            path="/employeeList"
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
