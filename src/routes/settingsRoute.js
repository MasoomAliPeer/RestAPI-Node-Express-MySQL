import express from "express";
const router = express.Router();
import {
  fetchEmailAndPhone,
  updateEmailOrPhone,
} from "../controllers/settingsController";

router.post("/fetch-email-phone", fetchEmailAndPhone);
router.post("/update-email-phone", updateEmailOrPhone);

export default router;
