import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import EmployeeList from "./pages/EmployeeList";
import EmployeeForm from "./pages/EmployeeForm";
import ProtectedRoute from "./components/ProtectedRote";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/employeelist" element={ <ProtectedRoute> <EmployeeList /> </ProtectedRoute>} />
        <Route path="/employeeform/add" element={<ProtectedRoute> <EmployeeForm /> </ProtectedRoute>} />
        <Route path="/employeeform/edit/:id" element={<ProtectedRoute> <EmployeeForm /> </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
