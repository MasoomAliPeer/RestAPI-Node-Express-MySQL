//* Import express and initialize the routers
import express from "express";
const router = express.Router();

import {
  getUser,
  register,
  loginUser,
  getQuestions,
  getCompanyList,
} from "../controllers/userController";

import verifyToken from "../middleware/verifyToken";

router.get("/getCompanyList", getCompanyList);
router.post("/register", register);
router.post("/login", loginUser);

router.post("/getQuestions", verifyToken, getQuestions);
router.get("/", verifyToken, getUser);

export default router;
