const dotenv = require("dotenv");
const mysql = require("mysql2");
const path = require("path");

// Load environment variables from .env file
const result = dotenv.config({ path: path.resolve(__dirname, "../../.env") });

if (result.error) {
  console.error("Error loading .env file:", result.error);
} else {
  console.log("Environment variables loaded:");
  console.log("DB_HOST:", process.env.DB_HOST);
  console.log("DB_USER:", process.env.DB_USER);
  console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
  console.log("DB_NAME:", process.env.DB_NAME);
  console.log("DB_PORT:", process.env.DB_PORT);
}

const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

dbConnection.connect((error) => {
  if (error) {
    if (error.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (error.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (error.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
    console.error("Error connecting to the database:", error);
  } else {
    console.log("Database connected");
  }
});

module.exports = dbConnection;
