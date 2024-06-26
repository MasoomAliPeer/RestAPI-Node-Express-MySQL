import dbConnection from "../database/dbConnection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authQueries from "../queries/authQueries";
import { MESSAGES } from "../config/messages";

const crypto = require("crypto");
import transporter from "../config/emailConfig";

import dotenv from "dotenv";
dotenv.config();

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

// Forgot Password Handler
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email exists
    const [user] = await dbConnection
      .promise()
      .query(authQueries.checkEmailExists, [email]);

    if (user.length === 0) {
      return res.status(404).json(MESSAGES.EMAIL_DOES_NOT_EXIST);
    }

    const token = crypto.randomBytes(20).toString("hex");
    const otp = Math.floor(100000 + Math.random() * 900000);

    await dbConnection
      .promise()
      .query(authQueries.updateTOKEN_OTP, [token, otp, email]);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        res.status(500).send(MESSAGES.ERROR_SENDING_EMAIL);
      } else {
        res.status(200).send(MESSAGES.OTP_SENT);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

// OTP Verification Handler
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const [rows] = await dbConnection
      .promise()
      .query(authQueries.verifyOTP, [email, otp]);

    if (rows.length > 0) {
      res.status(200).send(MESSAGES.OTP_VERIFIED);
    } else {
      res.status(400).send(MESSAGES.OTP_INCORRECT);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

// Reset Password Handler
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await dbConnection
      .promise()
      .query(authQueries.resetPassword, [hashedPassword, email]);

    res.status(200).send(MESSAGES.PASSWORD_SENT);
  } catch (error) {
    console.error(error);
    res.status(500).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};
