import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Select,
  InputLabel,
  FormControl,
  Paper,
  TableContainer,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Tooltip, InputAdornment } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";
import ExportButtons from "../components/ExportButtons";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FeaturedVideoIcon from "@mui/icons-material/FeaturedVideo";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetEmployeesQuery,
  useDeleteEmployeeMutation,
} from "../services/employeeapi";
import {
  setEmployees,
  deleteEmployee as deleteEmployeeFromStore,
} from "../features/employees/employeeSlice";
import TablePagination from "@mui/material/TablePagination";
import EmployeeDetailsModal from "../components/EmployeeDetailsModal";

const EmployeeListPage = () => {
  const surfaceColor = "#E8EDF2";
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { data: apiData, error, isLoading } = useGetEmployeesQuery();
  const [deleteEmployeeApi] = useDeleteEmployeeMutation();
  const employees = useSelector((state) => state.employees.list);
  const [filters, setFilters] = useState({
    department: "",
    designation: "",
    employeeType: "",
    status: "",
    location: "",
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openModal, setOpenModal] = useState(false);

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

  const filterOptions = {
    department: departments,
    designation: designations,
    employeeType: employeeTypes,
    status: statuses,
    location: locations,
  };
  const handleClearFilters = () => {
    setFilters({
      department: "",
      designation: "",
      employeeType: "",
      status: "",
      location: "",
    });
  };

  const handleOpenDetails = (emp) => {
    setSelectedEmployee(emp);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEmployee(null);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box p={4} sx={{ minHeight: "calc(100vh - 128px)" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          Employee List
        </Typography>

        <Box display="flex" gap={2} ml="auto">
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportExcel}
            sx={{
              backgroundColor: surfaceColor,
              color: "#000",
              textTransform: "none",
            }}
          >
            Export Excel
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/employeeform/add")}
            sx={{
              backgroundColor: surfaceColor,
              color: "#000",
              textTransform: "none",
            }}
          >
            Add Employee
          </Button>
        </Box>
      </Box>

      <Box
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        gap={2}
        justifyContent="space-between"
        bgcolor="#fff"
        py={2}
        mb={3}
        borderRadius={2}
      >
        <TextField
          placeholder="Search employee..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flex: 1,
            minWidth: 200,
            backgroundColor: surfaceColor,
            borderRadius: 1,
          }}
          InputProps={{
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearch("")}
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {Object.keys(filters).map((label) => (
          <FormControl
            key={label}
            size="small"
            sx={{
              minWidth: 160,
              backgroundColor: surfaceColor,
              borderRadius: 1,
            }}
          >
            <InputLabel>{label}</InputLabel>
            <Select
              label={label}
              value={filters[label]}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, [label]: e.target.value }))
              }
            >
              {filterOptions[label]?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

        <Tooltip title="Clear Filters">
          <IconButton
            color="error"
            sx={{ p: 1, bgcolor: surfaceColor }}
            onClick={handleClearFilters}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">Error fetching employees.</Typography>
        ) : filteredEmployees.length === 0 ? (
          <Typography>No employees found.</Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, boxShadow: 1 }}
          >
            <Box sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead sx={{ backgroundColor: surfaceColor }}>
                  <TableRow>
                    <TableCell>Sl. No</TableCell>
                    <TableCell>Profile</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Employee ID</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Designation</TableCell>
                    <TableCell>Employee Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((emp, index) => (
                      <TableRow key={emp.id}>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>
                          <Avatar src={emp.profilePreview} alt={emp.fullName}>
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
                            sx={{
                              backgroundColor: emp.status
                                ? "#c8f7c5"
                                : "#f9c0c0",
                              color: "#000",
                              width: 80,
                              textAlign: "center",
                              fontWeight: 500,
                              fontSize: "0.75rem",
                              borderRadius: "8px",
                            }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{emp.workLocation}</TableCell>
                        <TableCell>
                          <Tooltip title="Edit" arrow>
                            <IconButton
                              color="primary"
                              onClick={() => handleEdit(emp.id)}
                              sx={{
                                color: "#000",
                                textTransform: "none",
                                opacity: 0.5,
                              }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete" arrow>
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(emp.id)}
                              sx={{
                                color: "#000",
                                textTransform: "none",
                                opacity: 0.5,
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Details" arrow>
                            <IconButton
                              color="info"
                              onClick={() => handleOpenDetails(emp)}
                              sx={{
                                color: "#000",
                                textTransform: "none",
                                opacity: 0.5,
                              }}
                            >
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Generate ID Card" arrow>
                            <IconButton
                              color="info"
                              onClick={() => generateIdCardPDF(emp)}
                              sx={{
                                color: "#000",
                                textTransform: "none",
                                opacity: 0.5,
                              }}
                            >
                              <FeaturedVideoIcon
                                style={{ width: 24, height: 24 }}
                              />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredEmployees.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        )}
      </Box>

      <EmployeeDetailsModal
        open={openModal}
        onClose={handleCloseModal}
        employee={selectedEmployee}
      />
    </Box>
  );
};

export default EmployeeListPage;
