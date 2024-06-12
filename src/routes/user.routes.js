//* Import express and initialize the routers
import express from "express";
const router = express.Router();

import { getUser } from "../controllers/userController";

router.get("/", getUser); //localhost:3000/customers/

export default router;
