// controllers/user.controller.js
const bcrypt = require("bcryptjs");
const JobApplication = require("../models/JobApplication")
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
const Job = require("../models/Job")
const { sendEmail } = require("../services/emailService");
const cloudinary = require("../middleware/cloudinary");


// Secret key for JWT
dotenv.config();



// create admin user

exports.createUser = async (req, res) => {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name,
        username,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
};

// login admin

exports.userLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and password are required" });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid username or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ id: user._id }, "Charan@12345", {
            expiresIn: "1h",
        });

        res.json({ message: "Login successful", token, "name":user.name, "userId":user._id });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};

exports.getAllOpenToApplyJobsOfUser = async (req, res) => {
    const  userId  = req.user._id 

  
    try {
      // Step 1: Fetch all job IDs that the user has applied to

      const appliedJobs = await JobApplication.find({ userId }).select("jobId");

   
      // Extract job IDs from the `appliedJobs` result
      const appliedJobIds = appliedJobs.map((application) => application.jobId);
      
      // Step 2: Fetch all jobs where:
      // - `lastDateToApply` is in the future
      // - Job ID is not in the `appliedJobIds`
      const openToApplyJobs = await Job.find({
        _id: { $nin: appliedJobIds }, // Exclude applied job IDs
        lastDateToApply: { $gte: new Date() }, // Only include jobs with a valid application window
      });
      

      // Step 3: Return the jobs to the user
      res.status(200).json({
        message: "Open to apply jobs fetched successfully",
        jobs: openToApplyJobs,
      });
    } catch (error) {
      console.error("Error fetching open to apply jobs:", error);
      res.status(500).json({
        message: "Error fetching open to apply jobs",
        error: error.message,
      });
    }
  };

  exports.getAllNotAppliedJobs = async (req, res) => {
    const  userId  = req.user._id 

  
    try {
      // Step 1: Fetch all job IDs that the user has applied to

      const appliedJobs = await JobApplication.find({ userId }).select("jobId");

   
      // Extract job IDs from the `appliedJobs` result
      const appliedJobIds = appliedJobs.map((application) => application.jobId);
      
      // Step 2: Fetch all jobs where:
      // - `lastDateToApply` is in the future
      // - Job ID is not in the `appliedJobIds`
      const notAppliedJobs = await Job.find({
        _id: { $nin: appliedJobIds }, // Exclude applied job IDs
        lastDateToApply: { $lt: new Date() }, // Only include jobs with a valid application window
      });
      

      // Step 3: Return the jobs to the user
      res.status(200).json({
        message: "Not applied jobs fetched successfully",
        jobs: notAppliedJobs
      });
    } catch (error) {
      console.error("Error fetching not applied jobs:", error);
      res.status(500).json({
        message: "Error fetching not applied jobs",
        error: error.message,
      });
    }
  };  

  exports.getAllAppliedJobs = async (req, res) => {
    const  userId  = req.user._id 

  
    try {
      // Step 1: Fetch all job IDs that the user has applied to

      const appliedJobs = await JobApplication.find({
        userId,
        resumeShortlisted: { $exists: false }, // Field does not exist in the document
      }).select("jobId");

   
      // Extract job IDs from the `appliedJobs` result
      const appliedJobIds = appliedJobs.map((application) => application.jobId);
      
      // Step 2: Fetch all jobs where:
      // - `lastDateToApply` is in the future
      // - Job ID is not in the `appliedJobIds`
      const allAppliedJobs = await Job.find({
        _id: { $in: appliedJobIds }, // Exclude applied job IDs
      });
      

      // Step 3: Return the jobs to the user
      res.status(200).json({
        message: "All applied jobs fetched successfully",
        jobs: allAppliedJobs
      });
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      res.status(500).json({
        message: "Error fetching applied jobs",
        error: error.message,
      });
    }
  };  

  exports.getAllShortlistedJobs = async (req, res) => {
    const  userId  = req.user._id 

  
    try {
      // Step 1: Fetch all job IDs that the user has applied to

      const appliedJobs = await JobApplication.find({
        userId,
        $or: [
          { resumeShortlisted: true },  // Boolean true
          { resumeShortlisted: "true" } // String "true"
        ],
      }).select("jobId");

   
      // Extract job IDs from the `appliedJobs` result
      const appliedJobIds = appliedJobs.map((application) => application.jobId);
      
      // Step 2: Fetch all jobs where:
      // - `lastDateToApply` is in the future
      // - Job ID is not in the `appliedJobIds`
      const allAppliedJobs = await Job.find({
        _id: { $in: appliedJobIds }, // Exclude applied job IDs
      });
      

      // Step 3: Return the jobs to the user
      res.status(200).json({
        message: "All applied jobs fetched successfully",
        jobs: allAppliedJobs
      });
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      res.status(500).json({
        message: "Error fetching applied jobs",
        error: error.message,
      });
    }
  };  

  exports.getAllNotShortlistedJobs = async (req, res) => {
    const  userId  = req.user._id 

  
    try {
      // Step 1: Fetch all job IDs that the user has applied to

      const appliedJobs = await JobApplication.find({
        userId,
        $or: [
          { resumeShortlisted: false },  // Boolean true
          { resumeShortlisted: "false" } // String "true"
        ],
      }).select("jobId");

   
      // Extract job IDs from the `appliedJobs` result
      const appliedJobIds = appliedJobs.map((application) => application.jobId);
      
      // Step 2: Fetch all jobs where:
      // - `lastDateToApply` is in the future
      // - Job ID is not in the `appliedJobIds`
      const allAppliedJobs = await Job.find({
        _id: { $in: appliedJobIds }, // Exclude applied job IDs
      });
      

      // Step 3: Return the jobs to the user
      res.status(200).json({
        message: "All applied jobs fetched successfully",
        jobs: allAppliedJobs
      });
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      res.status(500).json({
        message: "Error fetching applied jobs",
        error: error.message,
      });
    }
  };  

  exports.fetchJobDetails = async (req, res) => {
    try {
      // Extract jobId from the URL params
      const { id } = req.params;
  
      // Find the job by jobId
      const job = await Job.findById(id);
  
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
  
      // Return the job details
      res.status(200).json(job);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching job details", error });
    }
  };

  exports.postUserJobApplication = async (req, res) => {
    const { 
        userName, userId, jobId, email 
    } = req.body;

    if (
        !userName || 
        !userId || 
        !jobId || 
        !email 
    ) {
        return res.status(400).json({ message: "Required fields are missing" });
    }

    // Check if `req.file` exists (image upload is mandatory)
    if (!req.file) {
        return res.status(400).json({ message: "Resume is required" });
    }

    const imageFile = req.file;

    let imageUrl = "";
        if (imageFile) {
            const result = await cloudinary.uploader.upload(imageFile.path);
            imageUrl = result.secure_url;
        }

    const newJobApplication = new JobApplication({
        userName,
        userId,
        jobId,
        email,
        resume: `${imageUrl}`
    });

    try {
      const job = await Job.findById(jobId);

      const subject = `Job Application Received - ${job.companyName}`;
      const text = `Your job application for our company ${job.companyName} for the role ${job.jobRole} is received. Thanks for applying for this job.`;

      const emailInfo = await sendEmail(email, subject, text);

        await newJobApplication.save();
        res.status(201).json({ message: "Job application created successfully", jobApplication: newJobApplication, emailInfo });
    } catch (error) {
        res.status(500).json({ message: "Error creating job application", error });
    }
};
