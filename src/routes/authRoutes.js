import express from "express";
const router = express.Router();

import {
  register,
  loginUser,
  getCompanyList,
  forgotPassword,
  resetPassword,
  verifyOtp,
} from "../controllers/authController";

router.get("/getCompanyList", getCompanyList);
router.post("/register", register);
router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
