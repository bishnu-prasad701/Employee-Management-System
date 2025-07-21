import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";

const EmployeeDetailsModal = ({ open, onClose, employee }) => {
  const handleDialogClose = (event, reason) => {
    if (reason === "backdropClick") return;
    onClose();
  };

  const InfoItem = ({ label, value }) => (
    <Box mb={1}>
      <Typography variant="body1">
        <strong>{label}:</strong> {value || "N/A"}
      </Typography>
    </Box>
  );

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
      <DialogTitle>Employee Details</DialogTitle>
      <DialogContent dividers>
        {employee && (
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Personal Info Card */}
            <Card variant="outlined">
              <CardHeader title="Personal Information" />
              <Divider />
              <CardContent>
                <Box display="flex" alignItems="center" mb={2} gap={2}>
                  <Avatar
                    src={employee.profilePreview}
                    sx={{ width: 64, height: 64 }}
                  >
                    {!employee.profilePreview && employee.fullName?.[0]}
                  </Avatar>
                  <Typography variant="h6">
                    {employee.fullName || "N/A"}
                  </Typography>
                </Box>
                <InfoItem label="Email" value={employee.email} />
                <InfoItem label="Phone" value={employee.phone} />
                <InfoItem
                  label="Emergency Contact"
                  value={employee.emergencyContact}
                />
                <InfoItem label="Date of Birth" value={employee.dob} />
              </CardContent>
            </Card>

            {/* Job Details Card with two columns */}
            <Card variant="outlined">
              <CardHeader title="Job Details" />
              <Divider />
              <CardContent>
                <Box display="flex" gap={4} flexWrap="wrap">
                  <Box flex={1} minWidth="45%">
                    <InfoItem label="Employee ID" value={employee.employeeId} />
                    <InfoItem label="Department" value={employee.department} />
                    <InfoItem
                      label="Designation"
                      value={employee.designation}
                    />
                    <InfoItem
                      label="Joining Date"
                      value={employee.joiningDate}
                    />
                    <InfoItem
                      label="Employee Type"
                      value={employee.employeeType}
                    />
                  </Box>
                  <Box flex={1} minWidth="45%">
                    <InfoItem
                      label="Work Location"
                      value={employee.workLocation}
                    />
                    <InfoItem
                      label="Status"
                      value={employee.status ? "Active" : "Inactive"}
                    />
                    <InfoItem
                      label="Is Admin"
                      value={employee.isAdmin ? "Yes" : "No"}
                    />
                    <InfoItem label="Manager" value={employee.managerId} />
                    <InfoItem label="Skills" value={employee.skills} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDetailsModal;
