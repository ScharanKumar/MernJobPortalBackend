const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming there's a User model
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job', // Assuming there's a Job model
      required: true,
    },
    resume: {
      type: String, // Storing the file path or URL of the resume
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
      },
      resumeShortlisted: {
        type: Boolean,
        required: false,
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
