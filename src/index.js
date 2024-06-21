import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import router from "./router";
import cors from "cors";
import bodyParser from "body-parser";

//* Initializations
const app = express();
dotenv.config();

//* Settings
const port = process.env.NODE_PORT || 3000;

//* Middlewares
app.use(morgan("dev"));

//* Enabling cors for all request by usiing cors middleware
app.use(cors());

/**
 * * Parse request of content-type: application/json
 * * Parses inconming request with JSON payloads
 */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Parse application/json
app.use(bodyParser.json({ limit: "50mb" }));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//* Routes
router(app);

//* Starting the server
app.listen(port, () => {
  console.log(`Server running in port ${port}`);
});
