export const MESSAGES = {
  INTERNAL_SERVER_ERROR: {
    ErrorCode: 500,
    Message: "Internal Server Error.",
  },

  FIELDS_CANNOT_BE_EMPTY: {
    ErrorCode: 204,
    Message: "Fields cannot be empty !",
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
    Message: "Email or phone number is required.",
  },

  USERNAME_DOES_NOT_EXIST: {
    ErrorCode: 401,
    Message: "Username doesn't exist ! Please register.",
  },

  INVALID_CREDENTIALS: {
    ErrorCode: 401,
    Message: "Invalid credentials.",
  },

  BOTH_USERID_AND_ASSESSMENTTYPEID_REQUIRED: {
    ErrorCode: 204,
    Message: "Both userId and assessmentTypeId are required.",
  },

  NO_DATA_AVAILABLE: {
    ErrorCode: 404,
    Message: "No data available.",
  },

  INVALID_REQUEST_BODY: {
    ErrorCode: 204,
    Message: "Please enter proper answer format !",
  },
  ANSWERS_ADDED_SUCCESSFULLY: {
    Message: "Details saved Successfully !",
  },
};
