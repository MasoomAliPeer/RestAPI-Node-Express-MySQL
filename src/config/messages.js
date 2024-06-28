export const MESSAGES = {
  INTERNAL_SERVER_ERROR: {
    ErrorCode: 500,
    Message: "Internal Server Error.",
  },

  FIELDS_CANNOT_BE_EMPTY: {
    ErrorCode: 204,
    Message: "Fields cannot be empty!",
  },

  EMAIL_OR_PHONE_EXISTS: {
    ErrorCode: 409,
    Message: "Email address or phone number already exists.",
  },

  USER_CREATED_SUCCESSFULLY: {
    Message: "User created successfully.",
  },

  EMAIL_OR_PHONE_REQUIRED: {
    ErrorCode: 204,
    Message: "Email ID or phone number is required.",
  },

  USERNAME_DOES_NOT_EXIST: {
    ErrorCode: 401,
    Message: "Username doesn't exist! Please register.",
  },

  EMAIL_DOES_NOT_EXIST: {
    ErrorCode: 401,
    Message: "Email ID doesn't exist! Please register.",
  },

  INVALID_CREDENTIALS: {
    ErrorCode: 401,
    Message: "Invalid credentials.",
  },

  BOTH_USERID_AND_ASSESSMENTTYPEID_REQUIRED: {
    ErrorCode: 204,
    Message: "Both User Id and Assessment Type Id required.",
  },

  NO_DATA_AVAILABLE: {
    ErrorCode: 404,
    Message: "No data available.",
  },

  INVALID_REQUEST_BODY: {
    ErrorCode: 204,
    Message: "Please enter proper details!",
  },

  ANSWERS_ADDED_SUCCESSFULLY: {
    Message: "Details saved Successfully! Redirecting to Dashboard.",
  },

  FETCH_SUCCESSFULLY: {
    Message: "Retrieved data Successfully!",
  },

  ERROR_SENDING_EMAIL: {
    Message: "Error sending email.",
  },
  OTP_SENT: {
    Message: "OTP sent to email.",
  },
  OTP_VERIFIED: {
    Message: "OTP verified!",
  },
  OTP_INCORRECT: {
    Message: "Incorrect OTP!",
  },
  OTP_REQUIRED: {
    Message: "OTP Required!",
  },
  PASSWORD_SENT: {
    Message: "Password reset successful",
  },

  USERID_REQUIRED: {
    Message: "UserId is required",
  },
  USER_NOT_FOUND: {
    Message: "User not found",
  },
};
