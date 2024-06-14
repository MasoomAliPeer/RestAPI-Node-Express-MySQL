//* Import express and initialize the routers
import express from "express";
const router = express.Router();

import {
  getUser,
  createNewUser,
  loginUser,
} from "../controllers/userController";

import verifyToken from "../middleware/verifyToken";

router.get("/", verifyToken, getUser);
router.post("/register", createNewUser);
router.post("/login", loginUser);

export default router;
