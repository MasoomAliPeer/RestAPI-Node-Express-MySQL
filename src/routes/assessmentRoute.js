import express from "express";
import verifyToken from "../middleware/verifyToken";

import {
  getQuestions,
  addAnswer,
  getAssessmentType,
  getDomainData,
  postAssessmentData,
  getAssessmentSummary,
  getAssessmentDetails,
} from "../controllers/assessmentController";

const router = express.Router();
router.use(verifyToken);

router.get("/getAssessmentType", getAssessmentType);
router.get("/getDomainData", getDomainData);

router.post("/postAssessmentData", postAssessmentData);
router.post("/getQuestions", getQuestions);
router.post("/addAnswers", addAnswer);

router.post("/getAssessmentSummary", getAssessmentSummary);
router.post("/getAssessmentDetails", getAssessmentDetails);

export default router;
