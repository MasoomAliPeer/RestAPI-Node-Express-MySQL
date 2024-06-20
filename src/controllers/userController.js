import dbConnection from "../database/dbConnection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { MESSAGES } from "../config/messages";
import * as userQueries from "../queries/userQueries";
import * as assessmentQueries from "../queries/assessmentQueries";

dotenv.config();

export const getUser = (req, res) => {
  dbConnection.query(userQueries.getAllUsers, (error, results) => {
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
    return res.status(400).json(MESSAGES.FIELDS_CANNOT_BE_EMPTY);
  }

  const normalizedEmail = emailAddress.toLowerCase();

  try {
    // Check if email or phone number already exists
    const [results] = await dbConnection
      .promise()
      .query(userQueries.checkUserExists, [normalizedEmail, phoneNumber]);

    if (results.length > 0) {
      return res.status(409).json(MESSAGES.EMAIL_OR_PHONE_EXISTS);
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Call the stored procedure with the provided data
    const [Result] = await dbConnection
      .promise()
      .query(userQueries.registerUser, [
        firstName,
        lastName,
        normalizedEmail,
        phoneNumber,
        hashedPassword,
        companyName,
      ]);

    res.status(201).json({
      Message: MESSAGES.USER_CREATED_SUCCESSFULLY.Message,
      Result, // Adjust if necessary
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const loginUser = (req, res) => {
  const { userName, password } = req.body;

  // Validate that loginField is present
  if (!userName) {
    return res.status(400).json(MESSAGES.EMAIL_OR_PHONE_REQUIRED);
  }

  dbConnection.query(
    userQueries.getUserByUsername,
    [userName],
    (error, results) => {
      if (error) throw error;

      if (results.length === 0) {
        return res.status(401).json(MESSAGES.USERNAME_DOES_NOT_EXIST);
      }

      const user = results[0];

      // Compare the provided password with the hashed password stored in the database
      const passwordIsValid = bcrypt.compareSync(password, user.Password);

      if (!passwordIsValid) {
        return res.status(401).json(MESSAGES.INVALID_CREDENTIALS);
      }

      // Generate a token (if needed)
      const token = jwt.sign({ id: user.UserId }, process.env.SECRET_KEY, {
        expiresIn: 86400, // 24 hours
      });

      res.status(200).json({
        UserId: user.UserId,
        accessToken: token,
      });
    }
  );
};

export const getQuestions = async (req, res) => {
  const { userId, assessmentTypeId } = req.body;

  // Validate input
  if (!userId || !assessmentTypeId) {
    return res
      .status(400)
      .json(MESSAGES.BOTH_USERID_AND_ASSESSMENTTYPEID_REQUIRED);
  }

  try {
    // Use promise-based dbConnection
    const [results] = await dbConnection
      .promise()
      .query(assessmentQueries.getSectionQuestionsByUserId, [
        userId,
        assessmentTypeId,
      ]);

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
        // answerTypeID : : add this : :
      });

      return acc;
    }, []);

    if (transformedResults.length === 0) {
      return res.status(404).json(MESSAGES.NO_DATA_AVAILABLE);
    }

    res.status(200).json(transformedResults);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

// Get list of companies
export const getCompanyList = async (req, res) => {
  try {
    const [results] = await dbConnection
      .promise()
      .query(assessmentQueries.getAllCompanies);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

// Get list of assessment types
export const getAssessmentType = async (req, res) => {
  try {
    const [results] = await dbConnection
      .promise()
      .query(assessmentQueries.getAllAssessmentTypes);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};
