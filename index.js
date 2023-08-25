const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/connectDB");
const app = express();

app.use(cors());
connectDB();

app.use(express.json());
app.use(cors());

// Routes

app.use("/question", require("./routes/api/questionHandler"));
app.use("/file", require("./routes/api/fileHandler"));

app.listen(3004, () => console.log(`Server running on port ${3004}`));
