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
        <Grid container spacing={2}>
          {/* Basic Info Fields */}
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
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={field.name}>
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

          {/* Dropdowns */}
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

          {/* Profile Picture Upload with Preview */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={1}
            >
              <Typography variant="body1">Profile Photo :</Typography>
              <Button variant="outlined" component="label" size="small">
                Choose File
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  name="profilePicture"
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

            {formData.profilePreview && (
              <Box mt={1}>
                <img
                  src={formData.profilePreview}
                  alt="Profile Preview"
                  style={{
                    width: "100%",
                    maxHeight: 150,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </Box>
            )}
          </Grid>

          {/* Status Toggle */}
          <Grid
            size={{ xs: 12, sm: 6, md: 3 }}
            display="flex"
            alignItems="center"
          >
            <Typography variant="body1" sx={{ mr: 2 }}>
              Status:
            </Typography>
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
            <Typography variant="body1" sx={{ mr: 2 }}>
              Admin:
            </Typography>
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
        </Grid>

        {/* Submit Button Bottom Right */}
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
