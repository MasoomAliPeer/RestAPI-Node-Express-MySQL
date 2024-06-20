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
        Message: "Email address or phone number already exists.",
      });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Call the stored procedure with the provided data
    const [Result] = await dbConnection
      .promise()
      .query(`CALL usp_User_Registration_Ins(?, ?, ?, ?, ?, ?)`, [
        firstName,
        lastName,
        normalizedEmail,
        phoneNumber,
        hashedPassword,
        companyName,
      ]);

    res.status(201).json({
      Message: "User created successfully.",
      Result, // Adjust if necessary
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ErrorCode: 500,
      Message: "Internal Server Error.",
    });
  }
};

export const loginUser = (req, res) => {
  const { userName, password } = req.body;

  // Validate that loginField is present
  if (!userName) {
    return res.status(400).json({
      ErrorCode: 204,
      Message: "Email or phone number is required.",
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
        Message: "Invalid credentials.",
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

export const getQuestions = async (req, res) => {
  const { userId, assessmentTypeId } = req.body;

  // Validate input
  if (!userId || !assessmentTypeId) {
    return res.status(400).json({
      ErrorCode: 400,
      Message: "Both userId and assessmentTypeId are required.",
    });
  }

  try {
    // Properly format the SQL query
    const sqlQuery = `CALL usp_get_section_question_details_by_user_id(?, ?)`;

    // Use promise-based dbConnection
    const [results] = await dbConnection
      .promise()
      .query(sqlQuery, [userId, assessmentTypeId]);

    // Transform the results
    const transformedResults = results[0].reduce((acc, current) => {
      const {
        SectionName,
        QuestionId,
        QuestionText,
        AnswerTypeName,
        QuestionWeightage,
      } = current;

      // Find or create the section
      let section = acc.find((section) => section.title === SectionName);
      if (!section) {
        section = { title: SectionName, questions: [] };
        acc.push(section);
      }

      // Add the question to the section
      section.questions.push({
        questionCode: QuestionId.toString(),
        questionText: QuestionText,
        answerType: AnswerTypeName, // Assuming default answer type, replace with actual logic if needed
        weightage: QuestionWeightage, // Assuming default weightage, replace with actual logic if needed
      });

      return acc;
    }, []);

    if (transformedResults.length === 0) {
      return res.status(404).json({
        ErrorCode: 404,
        Message: "No data available.",
      });
    }

    res.status(200).json(transformedResults);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({
      ErrorCode: 500,
      Message: "Internal Server Error.",
    });
  }
};

// Get list of companies
export const getCompanyList = async (req, res) => {
  try {
    const sqlQuery = "SELECT CompanyId, Name FROM company";
    const [results] = await dbConnection.promise().query(sqlQuery);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ErrorCode: 500,
      Message: "Internal Server Error.",
    });
  }
};

// Get list of assessment types
export const getAssessmentType = async (req, res) => {
  try {
    const sqlQuery = "SELECT AssessmentTypeId, Name FROM assessmenttype";
    const [results] = await dbConnection.promise().query(sqlQuery);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ErrorCode: 500,
      Message: "Internal Server Error.",
    });
  }
};
