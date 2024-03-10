const AsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
dotenv.config();
const Teacher = require("../model/Teacher");
const generateToken = require("../utils/generateToken");
const { hashPassword, isPasswordMatched } = require("../utils/helpers");
const Blog = require("../model/Blog");
const Advert = require("../model/Advert");
const Test = require("../model/Test");
const Student = require("../model/Student");

exports.login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user =
    (await Teacher.findOne({ email })) || (await Student.findOne({ email }));
  if (!user) {
    res.status(404);
    throw new Error("User Not Found");
  }

  //verify password
  const isMatch = await isPasswordMatched(password, user.password);

  if (!isMatch) {
    return res.json({ message: "Passwords don't match!" });
  } else {
    const accessToken = generateToken(
      user._id,
      process.env.JWT_ACCESS_EXPIRATION_HOURS
    ); // Access token expires in 1 hour
    const refreshToken = generateToken(
      user._id,
      process.env.JWT_REFRESH_EXPIRATION_DAYS
    ); // Refresh token expires in 7 days
    return res.json({
      success: true,
      message: "Passwords match!",
      accessToken,
      refreshToken,
      user,
    });
  }
});
