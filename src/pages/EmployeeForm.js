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
  Box,
  Checkbox,
  Divider,
  Avatar,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
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
  profilePreview: "",
  status: true,
  isAdmin: false,
  managerId: "",
  skills: "",
  dob: "",
  emergencyContact: "",
};

const designationOptions = {
  IT: ["IT Admin"],
  Tech: ["Software Trainee", "Associate Software Engineer"],
  HR: ["HR Assistant", "Senior HR"],
};

const EmployeeForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [designations, setDesignations] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const employeeId = id || null; // keep string id

  const employees = useSelector((state) => state.employees.list);
  const existingEmployee = employees.find((emp) => emp.id === employeeId);

  const [addEmployeeApi] = useAddEmployeeMutation();
  const [updateEmployeeApi] = useUpdateEmployeeMutation();

  useEffect(() => {
    if (existingEmployee) {
      setFormData(existingEmployee);
      setDesignations(designationOptions[existingEmployee.department] || []);
    }
  }, [existingEmployee]);

  useEffect(() => {
    if (formData.department) {
      const key = formData.department;
      const newDesignations = designationOptions[key] || [];
      setDesignations(newDesignations);

      // Clear designation if it's no longer valid
      if (!newDesignations.includes(formData.designation)) {
        setFormData((prev) => ({
          ...prev,
          designation: "",
        }));
      }
    }
  }, [formData.department]);

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
      setDesignations(designationOptions[value] || []);
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
    <Box sx={{ p: 4, mt: 4, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom>
        {employeeId ? "Update Employee" : "Add Employee"}
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Personal Info Section */}
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Personal Info
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {/* Left Fields */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={2}>
                {[
                  { label: "Full Name", name: "fullName" },
                  { label: "Email Address", name: "email", type: "email" },
                  { label: "Phone Number", name: "phone" },
                  { label: "Date of Birth", name: "dob", type: "date" },
                  { label: "Emergency Contact", name: "emergencyContact" },
                ].map((field) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={field.name}>
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
              </Grid>
            </Grid>

            {/* Right: Profile Picture */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                  border: "1px dashed #ccc",
                  borderRadius: "8px",
                  p: 2,
                  height: "100%",
                }}
              >
                <Avatar
                  src={formData.profilePreview}
                  sx={{ width: 100, height: 100, mb: 2 }}
                />
                <Button variant="outlined" component="label">
                  Upload Picture
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData((prev) => ({
                            ...prev,
                            profilePicture: reader.result,
                            profilePreview: reader.result,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Job Details Section */}
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Job Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {/* Employee ID */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
              />
            </Grid>

            {/* Department */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Autocomplete
                fullWidth
                options={["IT", "Tech", "HR"]}
                value={formData.department || null}
                onChange={(e, newValue) =>
                  setFormData({ ...formData, department: newValue })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Department" />
                )}
              />
            </Grid>

            {/* Designation */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Autocomplete
                fullWidth
                options={formData.department ? designations : []}
                value={formData.designation || null}
                onChange={(e, newValue) =>
                  setFormData({ ...formData, designation: newValue })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Designation" />
                )}
                disabled={!formData.department}
              />
            </Grid>

            {/* Employee Type */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Autocomplete
                fullWidth
                options={["Intern", "Full Time"]}
                value={formData.employeeType || null}
                onChange={(e, newValue) =>
                  setFormData({ ...formData, employeeType: newValue })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Employee Type" />
                )}
              />
            </Grid>

            {/* Work Location */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Autocomplete
                fullWidth
                options={["BBSR", "Gurgaon"]}
                value={formData.workLocation || null}
                onChange={(e, newValue) =>
                  setFormData({ ...formData, workLocation: newValue })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Work Location" />
                )}
              />
            </Grid>

            {/* Joining Date */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="Joining Date"
                name="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Status Switch */}
            <Grid
              size={{ xs: 12, sm: 6, md: 3 }}
              display="flex"
              alignItems="center"
            >
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

            {/* Is Admin */}
            <Grid
              size={{ xs: 12, sm: 6, md: 3 }}
              display="flex"
              alignItems="center"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isAdmin}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isAdmin: e.target.checked,
                      }))
                    }
                    name="isAdmin"
                  />
                }
                label="Is Admin"
              />
            </Grid>

            {/* Manager ID */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="Manager Name or ID"
                name="managerId"
                value={formData.managerId}
                onChange={handleChange}
              />
            </Grid>

            {/* Skills */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="Skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Submit Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button type="submit" variant="contained" color="primary">
            {employeeId ? "Update Employee" : "Add Employee"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
export default EmployeeForm;
