import dbConnection from "../database/dbConnection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authQueries from "../queries/authQueries";
import { MESSAGES } from "../config/messages";

export const getCompanyList = async (req, res) => {
  try {
    const [results] = await dbConnection
      .promise()
      .query(authQueries.getAllCompanies);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
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
    const [results] = await dbConnection
      .promise()
      .query(authQueries.checkUserExists, [normalizedEmail, phoneNumber]);

    if (results.length > 0) {
      return res.status(409).json(MESSAGES.EMAIL_OR_PHONE_EXISTS);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [Result] = await dbConnection
      .promise()
      .query(authQueries.registerUser, [
        firstName,
        lastName,
        normalizedEmail,
        phoneNumber,
        hashedPassword,
        companyName,
      ]);

    res.status(201).json({
      status: MESSAGES.USER_CREATED_SUCCESSFULLY,
      Result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const loginUser = (req, res) => {
  const { userName, password } = req.body;

  if (!userName) {
    return res.status(400).json(MESSAGES.FIELDS_CANNOT_BE_EMPTY);
  }

  try {
    dbConnection.query(
      authQueries.getUserByUsername,
      [userName, userName],
      (error, results) => {
        if (error) throw error;

        if (results.length === 0) {
          return res.status(401).json(MESSAGES.USERNAME_DOES_NOT_EXIST);
        }

        const user = results[0];

        const passwordIsValid = bcrypt.compareSync(password, user.Password);

        if (!passwordIsValid) {
          return res.status(401).json(MESSAGES.INVALID_CREDENTIALS);
        }

        const token = jwt.sign({ id: user.UserId }, process.env.SECRET_KEY, {
          expiresIn: 86400, // 24 hours
        });

        res.status(200).json({
          UserId: user.UserId,
          FirstName: user.FirstName,
          CompanyID: user.CompanyId,
          accessToken: token,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};
