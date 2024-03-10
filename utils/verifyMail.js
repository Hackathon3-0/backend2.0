const mailgun = require("mailgun-js");
const Student = require("../model/Student");
const Teacher = require("../model/Teacher");
require("dotenv").config();

const DOMAIN = "sandbox50a88326a68643edb2f834d08ec445fb.mailgun.org";
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

const studentSendEmail = async (req, res) => {
  const email = req.body.email;
  const student = await Student.findOne({ email });
  Student.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ error: "Student with this email does not exist." });
    }
    const mailVerificationToken = jwt.sign(
      { _id: user._id },
      process.env.MAILGUN_API_KEY,
      {
        expiresIn: "20m",
      }
    );

    const data = {
      from: "noreply@hello.com",
      to: email,
      subject: "Mail Verification Link",
      html: `
              <h2> Please click on given link to reset your password </h2>
              <p>http://localhost:3000/verifyLink/${mailVerificationToken}</p>
          `,
    };

    return student.updateOne(
      { resetLink: mailVerificationToken },
      function (err, success) {
        if (err) {
          return res
            .status(400)
            .json({ error: "mail verification link error" });
        } else {
          mg.messages().send(data, function (error, body) {
            if (error) {
              return res.json({
                error: err.message,
              });
            }
            return res.status(200).json({
              message: "Email has been sent, kindly follow the instructions.",
            });
          });
        }
      }
    );
  });
};

const teacherSendEmail = async (req, res) => {
  const email = req.body.email;
  const teacher = await Teacher.findOne({ email });
  Teacher.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ error: "Teacher with this email does not exists." });
    }
    const mailVerificationToken = jwt.sign(
      { _id: user._id },
      process.env.MAILGUN_API_KEY,
      {
        expiresIn: "20m",
      }
    );

    const data = {
      from: "noreply@hello.com",
      to: email,
      subject: "Mail Verification Link",
      html: `
              <h2> Please click on given link to reset your password </h2>
              <p>http://localhost:3000/verifyLink/${mailVerificationToken}</p>
          `,
    };

    return teacher.updateOne(
      { resetLink: mailVerificationToken },
      function (err, success) {
        if (err) {
          return res
            .status(400)
            .json({ error: "mail verification link error" });
        } else {
          mg.messages().send(data, function (error, body) {
            if (error) {
              return res.json({
                error: err.message,
              });
            }
            return res.status(200).json({
              message: "Email has been sent, kindly follow the instructions.",
            });
          });
        }
      }
    );
  });
};

module.exports = { studentSendEmail, teacherSendEmail };
