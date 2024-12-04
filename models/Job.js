const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true, 
  },
  jobRole: {
    type: String,
    required: true,
    trim: true,
  },
  salary: {
    type: String,
    required: false,
    trim: true,
  },
  noOfOpenings: {
    type: Number,
    required: true,
    min: 1, // Ensure at least one opening
  },
  location: {
    type: [String], // Array of strings
    required: true,
    validate: {
      validator: (value) => value.length > 0, // Ensure at least one location
      message: "At least one location is required",
    },
  },
  skill: {
    type: [String], // Array of strings
    required: true,
    validate: {
      validator: (value) => value.length > 0, // Ensure at least one skill
      message: "At least one skill is required",
    },
  },
  lastDateToApply: {
    type: Date,
    required: true,
    validate: {
      validator: (value) => value > new Date(), // Ensure the date is in the future
      message: "Last date to apply must be in the future",
    },
  },
  eligibilityCriteria: {
    type: String,
    required: false
  },
  aboutCompany: {
    type: String,
    required: false
  },
  importantNotes: {
    type: String,
    required: false
  },
  companyImage: {
    type: String, // File URL as a string
    required: true
  },
},
{ timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
