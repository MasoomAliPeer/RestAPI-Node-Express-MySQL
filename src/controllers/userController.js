import dbConnection from "../database/dbConnection";
import bcrypt from "bcrypt"; // Assuming passwords are hashed
import jwt from "jsonwebtoken"; // For generating JWT tokens
import dotenv from "dotenv";

dotenv.config();

export const getUser = (req, res) => {
  let sqlQuery = "SELECT * FROM user";

  dbConnection.query(sqlQuery, (error, results) => {
    if (error) throw error;
    res.status(200).json(results);
  });
};

export const createNewUser = (req, res) => {
  const user = req.body;
  const userObj = [
    user.FirstName,
    user.LastName,
    user.EmailAddress,
    bcrypt.hashSync(user.Password, 10), // Hash the password before storing it
    user.PhoneNumber,
  ];

  if (
    !user.FirstName ||
    !user.LastName ||
    !user.EmailAddress ||
    !user.Password ||
    !user.PhoneNumber
  ) {
    return res.json({
      ErrorCode: 204,
      Message: "Fields cannot be empty",
    });
  }

  let sqlQuery =
    "INSERT INTO user (FirstName, LastName, EmailAddress, Password, PhoneNumber) VALUES (?, ?, ?, ?, ?)";

  dbConnection.query(sqlQuery, userObj, (err, result) => {
    if (err) throw err;
    res.status(201).json("User created with id: " + result.insertId);
  });
};

export const loginUser = (req, res) => {
  const { loginField, Password } = req.body;

  // Validate that loginField is present
  if (!loginField) {
    return res.status(400).json({
      ErrorCode: 204,
      Message: "Email or phone number is required",
    });
  }

  let sqlQuery = `SELECT * from user where ( emailaddress = '${loginField}' or PhoneNumber = '${loginField}' )`;

  dbConnection.query(sqlQuery, [loginField], (error, results) => {
    if (error) throw error;

    if (results.length === 0) {
      return res.status(401).json({
        ErrorCode: 401,
        Message: "Invalid login credentials",
      });
    }

    const user = results[0];

    // Compare the provided password with the hashed password stored in the database
    const passwordIsValid = bcrypt.compareSync(Password, user.Password);

    if (!passwordIsValid) {
      return res.status(401).json({
        ErrorCode: 401,
        Message: "Invalid login credentials",
      });
    }

    // Generate a token (if needed)
    const token = jwt.sign({ id: user.UserId }, process.env.SECRET_KEY, {
      expiresIn: 86400, // 24 hours
    });

    res.status(200).json({
      UserId: user.UserId,
      accessToken: token,
    });
  });
};

export const getQuestions = (req, res) => {
  // Assuming you have a userId to pass
  const userId = req.body.userId; // Or wherever you get the userId from
  let sqlQuery = `CALL usp_get_section_question_details_by_user_id(${userId})`;

  dbConnection.query(sqlQuery, [userId], (error, results) => {
    if (error) throw error;
    res.status(200).json(results[0]); // Adjust results based on your procedure's output structure
  });
};

// export const getCustomersById = (req, res) => {
//   const id = parseInt(req.params.id);
//   let sqlQuery = `SELECT * FROM customers WHERE id = ${id}`;

//   // This method verifies that the id passed by parameter is a number, if it is not, it sends an error message
//   if (isNaN(id)) {
//     return res.json("You must enter a valid id as a parameter");
//   }

//   dbConnection.query(sqlQuery, (error, result) => {
//     if (error) throw error;
//     res.status(200).json(result[0]);
//   });
// };

// export const updateCustomer = (req, res) => {
//   const id = parseInt(req.params.id);
//   const customer = req.body;
//   const customerObj = [
//     customer.first_name,
//     customer.last_name,
//     customer.email,
//     customer.age,
//   ];

//   if (isNaN(id)) {
//     return res.json("You must enter a valid id as a parameter");
//   }

//   if (
//     !customer.first_name ||
//     !customer.last_name ||
//     !customer.email ||
//     !customer.age
//   ) {
//     return res.json({
//       ErrorCode: 204,
//       Message: "Fields cannot be empty",
//     });
//   }

//   let sqlQuery = `UPDATE customers SET first_name = ?, last_name = ?, email = ?, age = ? WHERE id = ${id}`;

//   dbConnection.query(sqlQuery, customerObj, (error, result) => {
//     if (error) throw error;
//     if (result.affectedRow === 0) {
//       res.send("No customer was updated");
//     }
//     res.json(`Customer with id ${id} updated successfully`);
//   });
// };

// export const deleteOneCustomer = (req, res) => {
//   const id = parseInt(req.params.id);

//   if (isNaN(id)) {
//     return res.json("You must enter a valid id as a parameter");
//   }

//   let sqlQuery = `DELETE FROM customers WHERE id = ${id}`;

//   dbConnection.query(sqlQuery, (error) => {
//     if (error) throw error;
//     res.status(200).json(`Customer with id ${id} deleted successfully`);
//   });
// };

// export const deleteAllCustomers = (req, res) => {
//   let sqlQuery = "TRUNCATE TABLE customers";

//   dbConnection.query(sqlQuery, (error) => {
//     if (error) throw error;
//     res.status(200).json("All records have been erased");
//   });
// };
