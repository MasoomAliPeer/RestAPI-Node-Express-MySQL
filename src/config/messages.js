export const MESSAGES = {
  FIELDS_CANNOT_BE_EMPTY: {
    ErrorCode: 204,
    Message: "Fields cannot be empty !",
  },
  EMAIL_OR_PHONE_EXISTS: {
    ErrorCode: 409,
    Message: "Email address or phone number already exists !",
  },
  USER_CREATED_SUCCESSFULLY: {
    Message: "User created successfully.",
  },
  EMAIL_OR_PHONE_REQUIRED: {
    ErrorCode: 204,
    Message: "Email or phone number is required !",
  },
  USERNAME_DOES_NOT_EXIST: {
    ErrorCode: 401,
    Message: "Username doesn't exist! Please register.",
  },
  INVALID_CREDENTIALS: {
    ErrorCode: 401,
    Message: "Invalid credentials !",
  },
  BOTH_USERID_AND_ASSESSMENTTYPEID_REQUIRED: {
    ErrorCode: 400,
    Message: "Both userId and assessmentTypeId are required !",
  },
  NO_DATA_AVAILABLE: {
    ErrorCode: 404,
    Message: "No data available.",
  },
  INTERNAL_SERVER_ERROR: {
    ErrorCode: 500,
    Message: "Internal Server Error.",
  },
};
