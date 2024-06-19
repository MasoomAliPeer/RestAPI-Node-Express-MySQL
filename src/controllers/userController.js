import dbConnection from "../database/dbConnection";
import bcrypt from "bcrypt"; // Assuming passwords are hashed
import jwt from "jsonwebtoken"; // For generating JWT tokens
import dotenv from "dotenv";

dotenv.config();

export const getUser = (req, res) => {
  let sqlQuery = "SELECT * FROM user";

  dbConnection.query(sqlQuery, (error, results) => {
    if (error) throw error;
    res.status(200).json(results);
  });
};

export const register = async (req, res) => {
  const {
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    password,
    companyName,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !emailAddress ||
    !phoneNumber ||
    !password ||
    !companyName
  ) {
    return res.status(400).json({
      ErrorCode: 204,
      Message: "Fields cannot be empty.",
    });
  }

  const normalizedEmail = emailAddress.toLowerCase();

  try {
    // Check if email or phone number already exists
    const [results] = await dbConnection
      .promise()
      .query(
        `SELECT 1 FROM user WHERE LOWER(EmailAddress) = ? OR PhoneNumber = ?`,
        [normalizedEmail, phoneNumber]
      );

    if (results.length > 0) {
      return res.status(409).json({
        ErrorCode: 409,
        Message: "Email address or phone number already exists",
      });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Call the stored procedure with the provided data
    const [procedureResult] = await dbConnection
      .promise()
      .query(`CALL usp_User_Package_Ins(?, ?, ?, ?, ?, ?)`, [
        firstName,
        lastName,
        normalizedEmail,
        phoneNumber,
        hashedPassword,
        companyName,
      ]);

    res.status(201).json({
      Message: "User created successfully",
      procedureResult, // Adjust if necessary
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ErrorCode: 500,
      Message: "Internal Server Error",
    });
  }
};

export const loginUser = (req, res) => {
  const { userName, password } = req.body;

  // Validate that loginField is present
  if (!userName) {
    return res.status(400).json({
      ErrorCode: 204,
      Message: "Email or phone number is required",
    });
  }

  let sqlQuery = `SELECT * from user where ( emailaddress = '${userName}' or PhoneNumber = '${userName}' )`;

  dbConnection.query(sqlQuery, [userName], (error, results) => {
    if (error) throw error;

    if (results.length === 0) {
      return res.status(401).json({
        ErrorCode: 401,
        Message: "Username doesn't exist! Please register.",
      });
    }

    const user = results[0];

    // Compare the provided password with the hashed password stored in the database
    const passwordIsValid = bcrypt.compareSync(password, user.Password);

    if (!passwordIsValid) {
      return res.status(401).json({
        ErrorCode: 401,
        Message: "Invalid credentials",
      });
    }

    // Generate a token (if needed)
    const token = jwt.sign({ id: user.UserId }, process.env.SECRET_KEY, {
      expiresIn: 86400, // 24 hours
    });

    res.status(200).json({
      UserId: user.UserId,
      accessToken: token,
    });
  });
};

export const getQuestions = (req, res) => {
  // Assuming you have a userId to pass
  const userId = req.body.userId; // Or wherever you get the userId from
  let sqlQuery = `CALL usp_get_section_question_details_by_user_id(${userId})`;

  dbConnection.query(sqlQuery, [userId], (error, results) => {
    if (error) throw error;
    res.status(200).json(results[0]); // Adjust results based on your procedure's output structure
  });
};

export const getCompanyList = (req, res) => {
  let sqlQuery = "SELECT * FROM company";

  dbConnection.query(sqlQuery, (error, results) => {
    if (error) throw error;
    res.status(200).json(results);
  });
};
