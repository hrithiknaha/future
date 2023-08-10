const express = require("express");
const app = express();

console.log("Environment:", process.env.NODE_ENV);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
