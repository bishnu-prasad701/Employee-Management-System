import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Button,
  Avatar,
  TextField,
  Box,
  Grid,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import {
  useGetEmployeesQuery,
  useDeleteEmployeeMutation,
} from "../services/employeeapi";
import {
  setEmployees,
  deleteEmployee as deleteEmployeeFromStore,
} from "../features/employees/employeeSlice";
import { useDispatch, useSelector } from "react-redux";

const EmployeeList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: apiData, error, isLoading } = useGetEmployeesQuery();
  const [deleteEmployeeApi] = useDeleteEmployeeMutation();
  const employees = useSelector((state) => state.employees.list);

  // Filters
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    designation: "",
    department: "",
    employeeType: "",
    status: "",
    location: "",
  });

  // Static dropdown options (optional: can be extracted from `employees`)
  const departments = ["IT", "Tech", "HR"];
  const designations = [
    "IT Admin",
    "Software Trainee",
    "Associate Software Engineer",
    "HR Assistant",
    "Senior HR",
  ];
  const employeeTypes = ["Intern", "Full Time"];
  const statuses = ["Active", "Inactive"];
  const locations = ["BBSR", "Gurgaon"];

  useEffect(() => {
    if (apiData) {
      dispatch(setEmployees(apiData));
    }
  }, [apiData, dispatch]);

  const handleEdit = (id) => navigate(`/employeeform/edit/${id}`);

  const handleDelete = async (id) => {
    try {
      await deleteEmployeeApi(id).unwrap();
      dispatch(deleteEmployeeFromStore(id));
      alert("Employee deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete employee");
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    // Convert filters.status string to boolean only if status filter is set
    let statusBool = filters.status === "Active" ? true : false;

    return (
      emp.fullName.toLowerCase().includes(search.toLowerCase()) &&
      (filters.department ? emp.department === filters.department : true) &&
      (filters.designation ? emp.designation === filters.designation : true) &&
      (filters.employeeType
        ? emp.employeeType === filters.employeeType
        : true) &&
      (filters.status ? emp.status === statusBool : true) &&
      (filters.location ? emp.workLocation === filters.location : true)
    );
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenDetails = (emp) => {
    setSelectedEmployee(emp);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEmployee(null);
  };

  return (
    <Paper sx={{ padding: 3, marginTop: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Employee List</Typography>
        <Box display="flex" gap={2}>
          <Button variant="outlined" color="success">
            Export Excel
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/employeeform/add")}
          >
            Add Employee
          </Button>
        </Box>
      </Box>

      {/* Filter Controls */}
      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Search by Name"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Autocomplete
            options={departments}
            value={filters.department}
            onChange={(_, value) =>
              setFilters({ ...filters, department: value || "" })
            }
            renderInput={(params) => (
              <TextField {...params} label="Department" variant="outlined" />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Autocomplete
            options={designations}
            value={filters.designation}
            onChange={(_, value) =>
              setFilters({ ...filters, designation: value || "" })
            }
            renderInput={(params) => (
              <TextField {...params} label="Designation" variant="outlined" />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Autocomplete
            options={employeeTypes}
            value={filters.employeeType}
            onChange={(_, value) =>
              setFilters({ ...filters, employeeType: value || "" })
            }
            renderInput={(params) => (
              <TextField {...params} label="Employee Type" variant="outlined" />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Autocomplete
            options={statuses}
            value={filters.status}
            onChange={(_, value) =>
              setFilters({ ...filters, status: value || "" })
            }
            renderInput={(params) => (
              <TextField {...params} label="Status" variant="outlined" />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Autocomplete
            options={locations}
            value={filters.location}
            onChange={(_, value) =>
              setFilters({ ...filters, location: value || "" })
            }
            renderInput={(params) => (
              <TextField {...params} label="Location" variant="outlined" />
            )}
          />
        </Grid>
      </Grid>

      {/* Table */}
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">Error fetching employees.</Typography>
      ) : filteredEmployees.length === 0 ? (
        <Typography>No employees found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1976d2" }}>
                <TableCell sx={{ color: "#fff" }}>Sl No.</TableCell>
                <TableCell sx={{ color: "#fff" }}>Profile</TableCell>
                <TableCell sx={{ color: "#fff" }}>Full Name</TableCell>
                <TableCell sx={{ color: "#fff" }}>Email</TableCell>
                <TableCell sx={{ color: "#fff" }}>Phone</TableCell>
                <TableCell sx={{ color: "#fff" }}>Department</TableCell>
                <TableCell sx={{ color: "#fff" }}>Designation</TableCell>
                <TableCell sx={{ color: "#fff" }}>Employee Type</TableCell>
                <TableCell sx={{ color: "#fff" }}>Status</TableCell>
                <TableCell sx={{ color: "#fff" }}>Location</TableCell>
                <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((emp, index) => (
                <TableRow key={emp.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Avatar src={emp.profilePreview} alt={emp.fullName}>
                      {!emp.profilePreview && emp.fullName?.[0]}
                    </Avatar>
                  </TableCell>
                  <TableCell>{emp.fullName}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.phone}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>{emp.designation}</TableCell>
                  <TableCell>{emp.employeeType}</TableCell>
                  <TableCell>
                    <Chip
                      label={emp.status ? "Active" : "Inactive"}
                      color={emp.status ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{emp.workLocation}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(emp.id)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(emp.id)}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      color="info"
                      onClick={() => handleOpenDetails(emp)}
                    >
                      <InfoIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent dividers>
          {selectedEmployee && (
            <Box display="flex" flexDirection="column" gap={1.5}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={selectedEmployee.profilePreview}
                  sx={{ width: 64, height: 64 }}
                >
                  {!selectedEmployee.profilePreview &&
                    selectedEmployee.fullName?.[0]}
                </Avatar>
                <Typography variant="h6">
                  {selectedEmployee.fullName}
                </Typography>
              </Box>

              <Typography>
                <strong>Employee ID:</strong> {selectedEmployee.employeeId}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedEmployee.email}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {selectedEmployee.phone}
              </Typography>
              <Typography>
                <strong>Department:</strong> {selectedEmployee.department}
              </Typography>
              <Typography>
                <strong>Designation:</strong> {selectedEmployee.designation}
              </Typography>
              <Typography>
                <strong>Joining Date:</strong> {selectedEmployee.joiningDate}
              </Typography>
              <Typography>
                <strong>Employee Type:</strong> {selectedEmployee.employeeType}
              </Typography>
              <Typography>
                <strong>Work Location:</strong> {selectedEmployee.workLocation}
              </Typography>
              <Typography>
                <strong>Status:</strong>{" "}
                {selectedEmployee.status ? "Active" : "Inactive"}
              </Typography>
              <Typography>
                <strong>Is Admin:</strong>{" "}
                {selectedEmployee.isAdmin ? "Yes" : "No"}
              </Typography>
              <Typography>
                <strong>Manager:</strong> {selectedEmployee.managerId}
              </Typography>
              <Typography>
                <strong>Skills:</strong> {selectedEmployee.skills}
              </Typography>
              <Typography>
                <strong>Date of Birth:</strong> {selectedEmployee.dob}
              </Typography>
              <Typography>
                <strong>Emergency Contact:</strong>{" "}
                {selectedEmployee.emergencyContact}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EmployeeList;
