// controllers/admin.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const dotenv = require("dotenv");
const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication")
const { sendEmail } = require("../services/emailService");
const cloudinary = require("../middleware/cloudinary");
const fs = require("fs");


// Secret key for JWT
dotenv.config();



// create admin user

exports.createAdmin = async (req, res) => {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
        name,
        username,
        password: hashedPassword,
    });

    try {
        await newAdmin.save();
        res.status(201).json({ message: "Admin created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating admin", error });
    }
};

// login admin

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and password are required" });
    }

    try {
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res
                .status(401)
                .json({ message: "Invalid username or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ id: admin._id }, "Charan@12345", {
            expiresIn: "1h",
        });

        res.json({ message: "Login successful", token, "name":admin.name });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};



exports.createJob = async (req, res) => {
    const { 
        companyName, 
        jobRole, 
        salary, 
        noOfOpenings, 
        location, 
        skill, 
        lastDateToApply, 
        eligibilityCriteria, 
        aboutCompany, 
        importantNotes 
    } = req.body;

    if (
        !companyName || 
        !jobRole || 
        !noOfOpenings || 
        !location || 
        !skill || 
        !lastDateToApply
    ) {
        return res.status(400).json({ message: "Required fields are missing" });
    }

    // Check if `req.file` exists (image upload is mandatory)
    if (!req.file) {
        return res.status(400).json({ message: "Company image is required" });
    }

    // Format data
    const formattedLocation = JSON.parse(location);
    const formattedSkill = JSON.parse(skill);

    const imageFile = req.file;

    // console.log("Uploaded File:", req.file);

    // console.log("Uploading File Path:", req.file.path);

        let imageUrl = "";
                if (imageFile) {
                    const result = await cloudinary.uploader.upload(imageFile.path);
                    imageUrl = result.secure_url;
                }

      //   const result = await cloudinary.uploader.upload(imageFile.path, {
      //     resource_type: "auto", // Use "raw" for PDFs & non-image files
      //     folder: "jobs", // Store under "jobs" folder in Cloudinary
      // });

      // console.log("UU ",result.secure_url);

      // imageUrl = result.secure_url.replace("/upload/", "/upload/fl_attachment/"); // Get the file URL
      // console.log("IMURL ", imageUrl);

      // Remove the local file after upload
      fs.unlinkSync(req.file.path);

        // console.log("Cloudinary Upload Response:", result);

    const newJob = new Job({
        companyName,
        jobRole,
        salary,
        noOfOpenings: Number(noOfOpenings),
        location: formattedLocation,
        skill: formattedSkill,
        lastDateToApply: new Date(lastDateToApply),
        eligibilityCriteria,
        aboutCompany,
        importantNotes,
        companyImage: imageUrl, // Save file path
    });

    try {
        await newJob.save();
        res.status(201).json({ message: "Job created successfully", job: newJob });
    } catch (error) {
        res.status(500).json({ message: "Error creating job", error });
    }
};

exports.fetchAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({}, "companyName jobRole companyImage location salary noOfOpenings lastDateToApply");
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ message: "No jobs found" });
        }
        res.status(200).json({ message: "Jobs fetched successfully", jobs });
    } catch (error) {
        res.status(500).json({ message: "Error fetching jobs", error });
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

  exports.fetchJobApplicationsOfAJob = async (req, res) => {
    try {
      // Extract jobId from the URL params
      const { jobId } = req.params;
  
      // Find the job by jobId
      const jobApplications = await JobApplication.find({ jobId: jobId })
  
      if (!jobApplications) {
        return res.status(404).json({ message: "Job not found" });
      }
  
      // Return the job details
      res.status(200).json(jobApplications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching job details", error });
    }
  };

  exports.updateJobApplicationStatusOfAUser = async (req, res) => {
    try {
      // Extract jobId from the URL params
      const { jobId, userId } = req.params;
      const {status} = req.body

      let result ;
      if (status === true || status ==="true"){
        result = true
      }
      if (status === false || status === "false"){
        result = false
      }

      if (result === undefined){
        res.status(404).json({message:"Please check your frontend code properly."})
      }
  
      // Find the job by jobId
      const jobApplication = await JobApplication.findOne({
        jobId: jobId, // Replace `jobId` with the specific ObjectId value
        userId: userId, // Replace `userId` with the specific ObjectId value
      });
  
      if (!jobApplication) {
        return res.status(404).json({ message: "Job application not found" });
      }

      const job = await Job.findById(jobId);

      let shortlistedOrNot;

      if (result === true){
             shortlistedOrNot = "shortlisted"
      }
      if (result === false){
         shortlistedOrNot = "rejected"
      }

      const subject = `Your job Application for our company ${job.companyName} is ${shortlistedOrNot}`;
      const text = `Your job application for our company ${job.companyName} for the role ${job.jobRole} is ${shortlistedOrNot}. Prepare well for next process of the interview. All the best.`;

      const emailInfo = await sendEmail(jobApplication.email, subject, text);

      jobApplication.resumeShortlisted = result;

  // Save the updated document
  await jobApplication.save();

  
      // Return the job details
      res.status(200).json(jobApplication);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating job application.", error });
    }
  };

  exports.updateJob = async (req, res) => {
    const {jobId} = req.params
    const jobData = req.body;


    if (jobData.lastDateToApply!==undefined){
      jobData.lastDateToApply= new Date(jobData.lastDateToApply)
    }

    if (jobData.location!==undefined){
      jobData.location= JSON.parse(jobData.location);
    }

    if (jobData.skill!==undefined){
      jobData.skill= JSON.parse(jobData.skill);
    }

    if (jobData.noOfOpenings!==undefined){
      jobData.noOfOpenings= Number(jobData.noOfOpenings)
    }

    try {
      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        { $set: jobData },
        { new: true, runValidators: true } // Return the updated document and validate data
      );
  
      if (!updatedJob) {
        return res.status(404).json({ error: 'Job not found' });
      }
  
      res.status(200).json({ message: 'Job updated successfully!', job: updatedJob });
    } catch (error) {
        res.status(500).json({ message: "Error creating job", error });
    }
};

exports.deleteJobAndApplications = async (req, res) => {
  const { id } = req.params; // Job ID from the request parameters

  try {
    // Step 1: Find the job to ensure it exists
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Step 2: Delete the job
    await Job.findByIdAndDelete(id);

    // Step 3: Delete all job applications associated with the job
    await JobApplication.deleteMany({ jobId: id });

    return res.status(200).json({
      message: 'Job and all associated job applications have been deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting job and applications:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};