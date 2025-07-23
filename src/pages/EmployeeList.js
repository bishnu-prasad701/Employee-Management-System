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
  Chip,
  Tooltip,
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
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import TablePagination from "@mui/material/TablePagination";
import EmployeeDetailsModal from "../components/EmployeeDetailsModal";
import ExportButtons from "../components/ExportButtons";

const EmployeeList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: apiData, error, isLoading } = useGetEmployeesQuery();
  const [deleteEmployeeApi] = useDeleteEmployeeMutation();
  const employees = useSelector((state) => state.employees.list);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    designation: "",
    department: "",
    employeeType: "",
    status: "",
    location: "",
  });

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
  const clearFilters = () => {
    setSearch("");
    setFilters({
      designation: "",
      department: "",
      employeeType: "",
      status: "",
      location: "",
    });
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const { handleExportExcel, generateIdCardPDF } = ExportButtons({ employees });

  useEffect(() => {
    if (apiData) {
      dispatch(setEmployees(apiData));
    }
  }, [apiData, dispatch]);

  const handleEdit = (id) => navigate(`/employeeform/edit/${id}`);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmDelete) return;

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
    <Paper sx={{ p: 2, m: 1 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Employee List</Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={clearFilters}
            sx={{ width: 150 }}
          >
            Clear Filters
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={handleExportExcel}
          >
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
        <Grid size={{ xs: 12 }}>
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
                  <TextField
                    {...params}
                    label="Department"
                    variant="outlined"
                  />
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
                  <TextField
                    {...params}
                    label="Designation"
                    variant="outlined"
                  />
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
                  <TextField
                    {...params}
                    label="Employee Type"
                    variant="outlined"
                  />
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
        </Grid>

        {/* Table */}
        <Grid size={{ xs: 12 }}>
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">Error fetching employees.</Typography>
          ) : filteredEmployees.length === 0 ? (
            <Typography>No employees found.</Typography>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Box sx={{ overflowX: "auto" }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#1976d2" }}>
                        <TableCell sx={{ color: "#fff" }}>Sl No.</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Profile</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Full Name</TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          Employee ID
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>Email</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Phone</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Department</TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          Designation
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          Employee Type
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>Status</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Location</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredEmployees
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((emp, index) => (
                          <TableRow key={emp.id}>
                            <TableCell>
                              {page * rowsPerPage + index + 1}
                            </TableCell>
                            <TableCell>
                              <Avatar
                                src={emp.profilePreview}
                                alt={emp.fullName}
                              >
                                {!emp.profilePreview && emp.fullName?.[0]}
                              </Avatar>
                            </TableCell>
                            <TableCell>{emp.fullName}</TableCell>
                            <TableCell>{emp.employeeId}</TableCell>
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
                              <Tooltip title="Edit" arrow>
                                <IconButton
                                  color="primary"
                                  onClick={() => handleEdit(emp.id)}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete" arrow>
                                <IconButton
                                  color="error"
                                  onClick={() => handleDelete(emp.id)}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="View Details" arrow>
                                <IconButton
                                  color="info"
                                  onClick={() => handleOpenDetails(emp)}
                                >
                                  <InfoIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Generate ID Card" arrow>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  sx={{ mt: 1 }}
                                  onClick={() => generateIdCardPDF(emp)}
                                >
                                  ID Card PDF
                                </Button>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Box>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredEmployees.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Grid>
      </Grid>
      <EmployeeDetailsModal
        open={openModal}
        onClose={handleCloseModal}
        employee={selectedEmployee}
      />
    </Paper>
  );
};

export default EmployeeList;
