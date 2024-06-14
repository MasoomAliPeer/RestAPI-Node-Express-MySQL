import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({
      ErrorCode: 403,
      Message: "No token provided",
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ErrorCode: 401,
        Message: "Unauthorized",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

export default verifyToken;
