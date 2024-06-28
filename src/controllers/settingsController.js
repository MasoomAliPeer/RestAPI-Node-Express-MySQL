import dbConnection from "../database/dbConnection";
import * as settingQueries from "../queries/settingQueries";
import { MESSAGES } from "../config/messages";

export const fetchEmailAndPhone = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json(MESSAGES.USERID_REQUIRED);
    }

    const [results] = await dbConnection
      .promise()
      .query(settingQueries.fetchEmailAndPhone, [userId]);

    if (results.length === 0) {
      return res.status(404).json(MESSAGES.USER_NOT_FOUND);
    }

    res.status(200).json(results[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const updateEmailOrPhone = async (req, res) => {
  try {
    const { userId, email, phone, otp } = req.body;

    if (!userId) {
      return res.status(400).json(MESSAGES.USERID_REQUIRED);
    }

    if (!email && !phone) {
      return res.status(400).json(MESSAGES.EMAIL_OR_PHONE_REQUIRED);
    }

    if (!otp) {
      return res.status(400).json(MESSAGES.OTP_REQUIRED);
    }

    const isOtpValid = await verifyOtp(userId, otp);
    if (!isOtpValid) {
      return res.status(400).json(MESSAGES.OTP_INCORRECT);
    }

    await dbConnection
      .promise()
      .query(settingQueries.updateEmailAndPhone, [email, phone, userId]);

    res.status(200).json(MESSAGES.ANSWERS_ADDED_SUCCESSFULLY);
  } catch (error) {
    console.error(error);
    res.status(500).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

// OTP Verification Function
const verifyOtp = async (userId, otp) => {
  const [rows] = await dbConnection
    .promise()
    .query(settingQueries.verifyOTP, [userId, otp]);
  return rows.length > 0;
};
