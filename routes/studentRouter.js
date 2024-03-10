const express = require("express");
const Student = require("../model/Student");
const isAuthenticated = require("../middlewares/isAuthenticated");
const roleRestriction = require("../middlewares/roleRestriction");
const {
  registerStudent,
  loginStudent,
  getAllStudents,
  getStudentProfile,
  updateStudentProfile,
  deleteStudent,
  addNewCategory,
  addMinTime,
  studentChoicesTeacher,
  studentCompleteTask,
  studentCompleteHomework,
  studentRateTeacher,
  studentLikeBlog,
  studentDislikeBlog,
  getAllBlogs,
} = require("../controller/studentController");
const sendEmail = require("../utils/verifyMail");
const studentRouter = express.Router();

studentRouter.post("/register", registerStudent);
studentRouter.get("/", getAllStudents);
studentRouter.get("/get-all-blogs", getAllBlogs);
studentRouter.get("/:id", getStudentProfile);
studentRouter.put(
  "/:id/update-profile",
  isAuthenticated(Student),
  roleRestriction("student"),
  updateStudentProfile
);
studentRouter.put(
  "/:id/add-category",
  isAuthenticated(Student),
  roleRestriction("student"),
  addNewCategory
);
studentRouter.put(
  "/:id/add-min-time",
  isAuthenticated(Student),
  roleRestriction("student"),
  addMinTime
);
studentRouter.put(
  "/:studentId/student-choose-teacher/:teacherId",
  isAuthenticated(Student),
  roleRestriction("student"),
  studentChoicesTeacher
);
studentRouter.put("/:id/student-complete-task", studentCompleteTask);
studentRouter.put(
  "/:studentId/student-complete-homework/:homeworkId",
  studentCompleteHomework
);
studentRouter.put(
  "/:studentId/student-rate-teacher/:teacherId",
  isAuthenticated(Student),
  roleRestriction("student"),
  studentRateTeacher
);
studentRouter.put(
  "/:studentId/verify-email/:token",
  isAuthenticated(Student),
  roleRestriction("student"),
  sendEmail
);
studentRouter.put(
  "/:studentId/student-like-blog/:blogId",
  isAuthenticated(Student),
  roleRestriction("student"),
  studentLikeBlog
);
studentRouter.put(
  "/:studentId/student-dislike-blog/:blogId",
  isAuthenticated(Student),
  roleRestriction("student"),
  studentDislikeBlog
);

studentRouter.delete("/:id/delete", deleteStudent);
module.exports = studentRouter;
