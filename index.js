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

const MONGODB_URI="mongodb+srv://9848charan:Charan%40123@cluster0.yq8er.mongodb.net/JobSearch?retryWrites=true&w=majority"

mongoose
    .connect(MONGODB_URI)
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
const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on ${`http://localhost:${port}`}`);
});