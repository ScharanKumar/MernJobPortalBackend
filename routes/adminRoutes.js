// routes/admin.js

const express = require('express');
const {
  createAdmin, login, createJob, fetchAllJobs, fetchJobDetails, fetchJobApplicationsOfAJob, updateJobApplicationStatusOfAUser, updateJob,deleteJobAndApplications
} = require('../controllers/adminController');


const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require("../middleware/multer");

router.post('/create', createAdmin);
router.post('/login', login);
router.put('/update/job/:jobId', updateJob);
router.post('/create/job',authMiddleware, upload.single("companyImage"), createJob);
router.get('/fetch/allJobs',authMiddleware, fetchAllJobs);
router.get('/fetch/jobDetails/:id',authMiddleware, fetchJobDetails);
router.get('/job/applications/:jobId',authMiddleware, fetchJobApplicationsOfAJob);
router.put('/update/job/application/:jobId/:userId',authMiddleware, updateJobApplicationStatusOfAUser);
router.delete('/delete/job/:id',authMiddleware, deleteJobAndApplications);


module.exports = router;
