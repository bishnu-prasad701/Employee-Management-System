// import React, { useState, useContext } from "react";
// import {
//   Box,
//   TextField,
//   Typography,
//   Button,
//   IconButton,
//   InputAdornment,
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import backgroundImage from "../img/backgroundimage.jpg";
// import { useAuth } from "../context/AuthContext";

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//     setErrors({});
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const { email, password } = formData;
//     const newErrors = {};

//     if (!email) newErrors.email = "Email is required";
//     else if (!email.includes("@") || !email.includes("."))
//       newErrors.email = "Enter a valid email";

//     if (!password) newErrors.password = "Password is required";

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     if (email !== "admin@gmail.com") {
//       setErrors({ email: "Email not found" });
//     } else if (password !== "admin123") {
//       setErrors({ password: "Incorrect password" });
//     } else {
//       login();
//       navigate("/employeeList");
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword((prev) => !prev);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100vh",
//         width: "100vw",
//         backgroundImage: `url(${backgroundImage})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         backgroundColor: "rgba(0, 60, 255, 0.05)",
//       }}
//     >
//       <Box
//         sx={{
//           maxWidth: 400,
//           width: "100%",
//           backgroundColor: "white",
//           padding: 4,
//           borderRadius: 2,
//           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <Typography
//           variant="h4"
//           align="center"
//           gutterBottom
//           sx={{ color: "#007bff" }}
//         >
//           <strong>Employee Login</strong>
//         </Typography>

//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="Email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             error={!!errors.email}
//             helperText={errors.email}
//             fullWidth
//             margin="normal"
//           />

//           <TextField
//             label="Password"
//             name="password"
//             type={showPassword ? "text" : "password"}
//             value={formData.password}
//             onChange={handleChange}
//             error={!!errors.password}
//             helperText={errors.password}
//             fullWidth
//             margin="normal"
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton onClick={togglePasswordVisibility} edge="end">
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />

//           <Button
//             type="submit"
//             variant="contained"
//             fullWidth
//             sx={{ mt: 3, backgroundColor: "#007bff" }}
//           >
//             Login
//           </Button>
//         </form>
//       </Box>
//     </Box>
//   );
// };

// export default LoginPage;

import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../img/backgroundimage.jpeg";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    else if (!email.includes("@") || !email.includes("."))
      newErrors.email = "Enter a valid email";

    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (email !== "admin@gmail.com") {
      setErrors({ email: "Email not found" });
    } else if (password !== "admin123") {
      setErrors({ password: "Incorrect password" });
    } else {
      login();
      navigate("/employeeList");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(3px)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 400,
          p: 4,
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#fff",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          Employee Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            margin="normal"
            InputProps={{
              sx: {
                backgroundColor: "rgba(255,255,255,0.9)",
                borderRadius: 1,
              },
            }}
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            margin="normal"
            InputProps={{
              sx: {
                backgroundColor: "rgba(255,255,255,0.9)",
                borderRadius: 1,
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            sx={{
              mt: 3,
              p: 1.2,
              fontWeight: 600,
              fontSize: "1rem",
              background: "#007bff",
              color: "#fff",
              "&:hover": {
                background: "#0056b3",
              },
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
