import express from "express";
import verifyToken from "../middleware/verifyToken";

import {
  getQuestions,
  addAnswer,
  getAssessmentType,
} from "../controllers/assessmentController";

const router = express.Router();
router.use(verifyToken);

router.get("/getAssessmentType", getAssessmentType);
router.post("/getQuestions", getQuestions);
router.post("/addAnswers", addAnswer);

export default router;
