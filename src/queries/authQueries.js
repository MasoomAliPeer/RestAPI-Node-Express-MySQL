export const getAllCompanies = `SELECT CompanyId, Name FROM company`;

export const checkUserExists = `SELECT 1 FROM user WHERE LOWER(EmailAddress) = ? OR PhoneNumber = ?`;

export const registerUser = `CALL usp_User_Registration_Ins(?, ?, ?, ?, ?, ?)`;

export const getUserByUsername = `SELECT * FROM user WHERE emailaddress = ? OR PhoneNumber = ?`;
