import express from "express";
const router = express.Router();

import {
  register,
  loginUser,
  getCompanyList,
} from "../controllers/authController";

router.get("/getCompanyList", getCompanyList);
router.post("/register", register);
router.post("/login", loginUser);

export default router;
