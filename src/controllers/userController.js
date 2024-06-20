import dbConnection from "../database/dbConnection";

export const getUser = (req, res) => {
  let sqlQuery = "SELECT * FROM user";

  dbConnection.query(sqlQuery, (error, results) => {
    if (error) throw error;
    res.status(200).json(results);
  });
};

