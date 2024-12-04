const express = require('express');
const {
  createUser, userLogin, getAllOpenToApplyJobsOfUser, fetchJobDetails, getAllNotAppliedJobs, getAllAppliedJobs, postUserJobApplication,
  getAllNotShortlistedJobs, getAllShortlistedJobs
} = require('../controllers/userController');


const router = express.Router();
const authUserMiddleware = require('../middleware/authUserMiddleware');
const upload = require("../middleware/multer");

router.post('/create', createUser);
router.post('/login', userLogin);
router.get('/fetch/openToApply/jobs', authUserMiddleware, getAllOpenToApplyJobsOfUser);
router.get('/fetch/notApplied/jobs', authUserMiddleware, getAllNotAppliedJobs);
router.get('/fetch/applied/jobs', authUserMiddleware, getAllAppliedJobs);
router.get('/fetch/shortlisted/jobs', authUserMiddleware, getAllShortlistedJobs);
router.get('/fetch/notShortlisted/jobs', authUserMiddleware, getAllNotShortlistedJobs);
router.get('/fetch/jobDetails/:id',authUserMiddleware, fetchJobDetails);
router.post('/apply/job',authUserMiddleware,upload.single("resume"), postUserJobApplication);

module.exports = router;