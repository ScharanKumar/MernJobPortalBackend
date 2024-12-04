const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();
app.use(express.static('uploads'));

// Middleware
app.use(cors())
app.use(express.json({ limit: '32mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        

        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the LMS API!" });
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on ${process.env.BACKEND_URL || `http://localhost:${port}`}`);
});