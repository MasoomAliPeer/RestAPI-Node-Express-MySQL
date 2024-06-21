import express from "express";
import verifyToken from "../middleware/verifyToken";

import {
  getQuestions,
  addAnswer,
  getAssessmentType,
  getDomainData,
} from "../controllers/assessmentController";

const router = express.Router();
router.use(verifyToken);

router.get("/getAssessmentType", getAssessmentType);
router.get("/getDomainData", getDomainData);
router.post("/getQuestions", getQuestions);
router.post("/addAnswers", addAnswer);

export default router;