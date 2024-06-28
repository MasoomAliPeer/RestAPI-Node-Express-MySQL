export const fetchEmailAndPhone =
  "SELECT EmailAddress, PhoneNumber FROM user WHERE UserId = ?";
export const updateEmailAndPhone =
  "UPDATE user SET EmailAddress = IFNULL(?, EmailAddress), PhoneNumber = IFNULL(?, PhoneNumber) WHERE UserId = ?";

export const verifyOTP = `SELECT * FROM user WHERE UserId = ? AND OTP = ?`;
