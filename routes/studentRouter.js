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
} = require("../controller/studentController");
const studentRouter = express.Router();

studentRouter.post("/register", registerStudent);
studentRouter.get("/", getAllStudents);
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

studentRouter.delete("/:id/delete", deleteStudent);
module.exports = studentRouter;
