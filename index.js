require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const app = express();

axios.defaults.baseURL = "https://www.googleapis.com";
axios.defaults.headers.post["Content-Type"] = "application/json";

const connectDB = require("./config/db");
const bookRoutes = require("./routers/bookRoutes");
const authRoutes = require("./routers/authRoutes");

const verifyJWT = require("./middleware/verifyJWT");

console.log("Environment:", process.env.NODE_ENV);

connectDB();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/books", verifyJWT, bookRoutes);

const PORT = process.env.PORT || 5001;
mongoose.connection.once("open", () => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
