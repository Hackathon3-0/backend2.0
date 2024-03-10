const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return {
        msg: "Invalid Token ! ",
      };
    } else {
      return decoded;
    }
  });
};
module.exports = verifyToken;
