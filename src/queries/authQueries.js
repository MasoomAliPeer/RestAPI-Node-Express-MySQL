export const getAllCompanies = `SELECT CompanyId, Name FROM company`;

export const checkUserExists = `SELECT 1 FROM user WHERE LOWER(EmailAddress) = ? OR PhoneNumber = ?`;

export const registerUser = `CALL usp_User_Registration_Ins(?, ?, ?, ?, ?, ?)`;

// export const getUserByUsername = `SELECT * FROM user WHERE emailaddress = ? OR PhoneNumber = ?`;

export const getUserByUsername = `SELECT DISTINCT U.UserId, U.FirstName, U.Password, C.CompanyId, C.Name AS CompanyName FROM ceat.User AS U INNER JOIN ceat.UserCompany AS Uc ON U.UserId = Uc.UserId AND U.IsActive = 1 AND Uc.IsActive = 1 INNER JOIN ceat.Company AS C ON Uc.CompanyId = C.CompanyId AND C.IsActive = 1 WHERE ( U.EmailAddress = ? OR U.PhoneNumber = ? )`;
