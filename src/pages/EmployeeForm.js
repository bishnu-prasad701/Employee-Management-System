import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Switch,
  FormControlLabel,
  FormControl,
  FormHelperText,
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
  dateOfBirth: "",
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
  const [formErrors, setFormErrors] = useState({});

  const disabled = !formData.department;

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
    } else if (name === "phone" || name === "emergencyContact") {
      // Restrict to digits only and max 10 characters
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validateForm = (formData) => {
      const errors = {};

      for (const field in formData) {
        // Skip profilePicture here to handle it separately
        if (
          field !== "profilePicture" &&
          (formData[field] === "" ||
            formData[field] === null ||
            formData[field] === undefined)
        ) {
          errors[field] = "This field is required";
        }
      }

      // Require profilePicture only if adding a new employee (no employeeId)
      if (!employeeId) {
        if (!formData.profilePicture) {
          errors.profilePicture = "This field is required";
        }
      }

      // Email validation
      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        errors.email = "Enter a valid email with @ and .";
      }

      // Phone validation (10-digit Indian number)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone || "")) {
        errors.phone = "Enter a valid 10-digit Indian number";
      }
      if (!phoneRegex.test(formData.emergencyContact || "")) {
        errors.emergencyContact = "Enter a valid 10-digit Indian number";
      }

      // Date validation
      const today = new Date().toISOString().split("T")[0];
      if (formData.dateOfBirth && formData.dateOfBirth > today) {
        errors.dateOfBirth = "Date of birth cannot be in the future";
      }
      if (formData.joiningDate && formData.joiningDate > today) {
        errors.joiningDate = "Joining date cannot be in the future";
      }

      return errors;
    };

    // Run validation
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // 🔍 Check for duplicate Employee ID if adding new
    if (!employeeId) {
      const isDuplicateId = employees.some(
        (emp) =>
          String(emp.employeeId).trim() === String(formData.employeeId).trim()
      );
      if (isDuplicateId) {
        setFormErrors((prev) => ({
          ...prev,
          employeeId: "Employee ID already exists",
        }));
        return;
      }
    }

    try {
      const submissionData = {
        ...formData,
        profilePicture:
          formData.profilePicture && formData.profilePicture instanceof File
            ? formData.profilePicture.name
            : formData.profilePicture || "",
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

      navigate("/employeeList");
    } catch (err) {
      console.error("Failed to submit:", err);
      alert("Error submitting form");
    }
  };

  return (
    <Box sx={{ p: 2, m: 1, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom>
        {employeeId ? "Update Employee" : "Add Employee"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Personal Info
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={2}>
                {[
                  { label: "Full Name", name: "fullName" },
                  { label: "Email Address", name: "email", type: "email" },
                  { label: "Phone Number", name: "phone" },
                  { label: "Date of Birth", name: "dateOfBirth", type: "date" },
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
                      error={!!formErrors[field.name]}
                      helperText={formErrors[field.name]}
                      InputLabelProps={
                        field.type === "date" ? { shrink: true } : undefined
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl
                fullWidth
                error={!!formErrors.profilePicture}
                sx={{ mt: 2 }}
              >
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
                {formData.profilePicture && !formErrors.profilePicture && (
                  <FormHelperText sx={{ color: "green" }}>
                    Profile Picture is present
                  </FormHelperText>
                )}
                {formErrors.profilePicture && (
                  <FormHelperText>{formErrors.profilePicture}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Job Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                error={!!formErrors.employeeId}
                helperText={formErrors.employeeId}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Autocomplete
                fullWidth
                options={["IT", "Tech", "HR"]}
                value={formData.department || null}
                onChange={(e, newValue) =>
                  setFormData({ ...formData, department: newValue })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Department"
                    error={!!formErrors.department}
                    helperText={formErrors.department}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Autocomplete
                fullWidth
                options={formData.department ? designations : []}
                value={formData.designation || null}
                onChange={(e, newValue) =>
                  setFormData({ ...formData, designation: newValue })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Designation"
                    error={!disabled && !!formErrors.designation}
                    helperText={!disabled && formErrors.designation}
                  />
                )}
                disabled={!formData.department}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Autocomplete
                fullWidth
                options={["Intern", "Full Time"]}
                value={formData.employeeType || null}
                onChange={(e, newValue) =>
                  setFormData({ ...formData, employeeType: newValue })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Employee Type"
                    error={!!formErrors.employeeType}
                    helperText={formErrors.employeeType}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Autocomplete
                fullWidth
                options={["BBSR", "Gurgaon"]}
                value={formData.workLocation || null}
                onChange={(e, newValue) =>
                  setFormData({ ...formData, workLocation: newValue })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Work Location"
                    error={!!formErrors.workLocation}
                    helperText={formErrors.workLocation}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="Joining Date"
                name="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!formErrors.joiningDate}
                helperText={formErrors.joiningDate}
              />
            </Grid>

            <Grid
              size={{ xs: 12, sm: 6, md: 3 }}
              display="flex"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography>Status:</Typography>
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
              </Box>
            </Grid>

            <Grid
              size={{ xs: 12, sm: 6, md: 3 }}
              display="flex"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography>Admin:</Typography>
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
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="Manager Name or ID"
                name="managerId"
                value={formData.managerId}
                onChange={handleChange}
                error={!!formErrors.managerId}
                helperText={formErrors.managerId}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="Skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                error={!!formErrors.skills}
                helperText={formErrors.skills}
              />
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setFormData(initialState);
              setDesignations([]);
            }}
          >
            Clear Form
          </Button>

          <Button type="submit" variant="contained" color="primary">
            {employeeId ? "Update Employee" : "Add Employee"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
export default EmployeeForm;
