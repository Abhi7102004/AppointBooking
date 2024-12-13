const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const mongoUrl = require("./config/db");
const userRoutes = require("./routes/user-route");
const availabilityRoutes = require("./routes/availability-route");
const appointmentRoutes = require("./routes/appointment-route");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const PORT = process.env.PORT | 3002;
app.use("/api/user", userRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/appointment", appointmentRoutes);
app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
