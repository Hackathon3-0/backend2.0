const jwt = require("jsonwebtoken");

const generateToken = (id, expiresIn) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn,
  });
};
//frontend should keep the token in the localstorage
module.exports = generateToken;
