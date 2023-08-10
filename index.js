const express = require("express");
const app = express();

const bookRoutes = require("./routers/bookRoutes");

console.log("Environment:", process.env.NODE_ENV);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/books", bookRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
