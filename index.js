require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

axios.defaults.baseURL = "https://www.googleapis.com";
axios.defaults.headers.post["Content-Type"] = "application/json";

const corsOptions = require("./configs/corsOption");
const connectDB = require("./configs/db");
const bookRoutes = require("./routers/bookRoutes");
const authRoutes = require("./routers/authRoutes");
const userRoutes = require("./routers/userRoutes");
const statsRoutes = require("./routers/statRoutes");

const verifyJWT = require("./middleware/verifyJWT");

console.log("Environment:", process.env.NODE_ENV);

connectDB();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/books", verifyJWT, bookRoutes);
app.use("/api/users", verifyJWT, userRoutes);
app.use("/api/stats", verifyJWT, statsRoutes);

const PORT = process.env.PORT || 5001;
mongoose.connection.once("open", () => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
