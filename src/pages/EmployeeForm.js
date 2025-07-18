import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
} from "../services/employeeapi";
import {
  addEmployee,
  updateEmployee,
} from "../features/employees/employeeSlice";

const initialState = {
  fullName: "",
  employeeId: "",
  email: "",
  phone: "",
  designation: "",
  department: "",
  joiningDate: "",
  employeeType: "",
  workLocation: "",
  profilePicture: null,
  status: true,
  isAdmin: false,
  managerId: "",
  skills: "",
  dob: "",
  emergencyContact: "",
};

const designationOptions = {
  it: ["IT Admin"],
  tech: ["Software Trainee", "Associate Software Engineer"],
  hr: ["HR Assistant", "Senior HR"],
};

const EmployeeForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [designations, setDesignations] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const employeeId = id ? parseInt(id) : null;

  const employees = useSelector((state) => state.employees.list);
  const existingEmployee = employees.find((emp) => emp.id === employeeId);

  const [addEmployeeApi] = useAddEmployeeMutation();
  const [updateEmployeeApi] = useUpdateEmployeeMutation();

  useEffect(() => {
    if (existingEmployee) {
      setFormData(existingEmployee);
      setDesignations(
        designationOptions[existingEmployee.department.toLowerCase()] || []
      );
    }
  }, [existingEmployee]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "profilePicture") {
      setFormData((prev) => ({
        ...prev,
        profilePicture: files[0],
      }));
    } else if (name === "status") {
      setFormData((prev) => ({
        ...prev,
        status: checked,
      }));
    } else if (name === "department") {
      setFormData((prev) => ({
        ...prev,
        department: value,
        designation: "", // reset designation
      }));
      setDesignations(designationOptions[value.toLowerCase()] || []);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submissionData = {
        ...formData,
        profilePicture: formData.profilePicture?.name || "",
      };

      if (employeeId) {
        const updated = { ...submissionData, id: employeeId };
        await updateEmployeeApi(updated).unwrap();
        dispatch(updateEmployee(updated));
        alert("Employee updated successfully");
      } else {
        const response = await addEmployeeApi(submissionData).unwrap();
        dispatch(addEmployee(response));
        alert("Employee added successfully");
      }

      navigate("/employeelist");
    } catch (err) {
      console.error("Failed to submit:", err);
      alert("Error submitting form");
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "2rem", marginTop: "2rem" }}>
      <Typography variant="h5" gutterBottom>
        {employeeId ? "Edit Employee" : "Add Employee"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Text Inputs */}
          {[
            { label: "Full Name", name: "fullName" },
            { label: "Employee ID", name: "employeeId" },
            { label: "Email Address", name: "email", type: "email" },
            { label: "Phone Number", name: "phone" },
            { label: "Joining Date", name: "joiningDate", type: "date" },
            { label: "Manager Name or ID", name: "managerId" },
            { label: "Skills", name: "skills" },
            { label: "Date of Birth", name: "dob", type: "date" },
            { label: "Emergency Contact", name: "emergencyContact" },
          ].map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              <TextField
                fullWidth
                label={field.label}
                name={field.name}
                type={field.type || "text"}
                value={formData[field.name]}
                onChange={handleChange}
                InputLabelProps={
                  field.type === "date" ? { shrink: true } : undefined
                }
              />
            </Grid>
          ))}

          {/* Department Dropdown */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              {["it", "tech", "hr"].map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept.toUpperCase()}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Designation Dropdown */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              disabled={!formData.department}
            >
              {designations.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Employee Type */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Employee Type"
              name="employeeType"
              value={formData.employeeType}
              onChange={handleChange}
            >
              {["Intern", "Full Time"].map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Work Location */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Work Location"
              name="workLocation"
              value={formData.workLocation}
              onChange={handleChange}
            >
              {["BBSR", "Gurgaon"].map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Profile Picture Upload */}
          <Grid item xs={12} sm={6}>
            <Button variant="outlined" component="label" fullWidth>
              Upload Profile Picture
              <input
                type="file"
                hidden
                accept="image/*"
                name="profilePicture"
                onChange={handleChange}
              />
            </Button>
            {formData.profilePicture?.name && (
              <Typography variant="caption">
                Selected: {formData.profilePicture.name}
              </Typography>
            )}
          </Grid>

          {/* Status Switch */}
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status}
                  onChange={handleChange}
                  name="status"
                  color="primary"
                />
              }
              label={formData.status ? "Active" : "Inactive"}
            />
          </Grid>

          {/* Is Admin Dropdown */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Is Admin"
              name="isAdmin"
              value={formData.isAdmin}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isAdmin: e.target.value === "true",
                }))
              }
            >
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </TextField>
          </Grid>

          {/* Submit */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {employeeId ? "Update Employee" : "Add Employee"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default EmployeeForm;
