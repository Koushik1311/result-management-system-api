import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllStudentResults,
  getStudentResultsByStudentId,
  saveAttendanceMarks,
  saveAssessmentMarks,
  saveLinkedInPostMarks,
  saveProjectReviewMarks,
  saveProjectSubmissionMarks,
} from "../controllers/student.controller.js";

const router = Router();

router.route("/").get(getAllStudentResults);
router.route("/:studentId").get(getStudentResultsByStudentId);
router.route("/save-attendence-marks").post(verifyJWT, saveAttendanceMarks);
router.route("/save-assessment-marks").post(verifyJWT, saveAssessmentMarks);
router.route("/save-linkedin-marks").post(verifyJWT, saveLinkedInPostMarks);
router
  .route("/save-project-review-marks")
  .post(verifyJWT, saveProjectReviewMarks);
router
  .route("/save-project-submission-marks")
  .post(verifyJWT, saveProjectSubmissionMarks);

export default router;
