const express = require("express");

const Teacher = require("../model/Teacher");
const isAuthenticated = require("../middlewares/isAuthenticated");
const roleRestriction = require("../middlewares/roleRestriction");
const {
  registerTeacher,
  loginTeacher,
  getAllTeachers,
  getTeacherProfile,
  updateTeacherProfile,
  deleteTeacher,
  addNewCategory,
  teacherPublishBlog,
  teacherPublishAdvert,
  demoCreateTest,
  teacherAssignHomework,
  getMyBlog,
} = require("../controller/teacherController");
const { teacherSendEmail } = require("../utils/verifyMail");
const teacherRouter = express.Router();

teacherRouter.post("/register", registerTeacher);
teacherRouter.get("/", getAllTeachers);
teacherRouter.get("/:id", getTeacherProfile);
teacherRouter.get("/:teacherId/get-my-blog", getMyBlog);
teacherRouter.put(
  "/:id/update-profile",
  isAuthenticated(Teacher),
  roleRestriction("teacher"),
  updateTeacherProfile
);
teacherRouter.put(
  "/:id/add-category",
  isAuthenticated(Teacher),
  roleRestriction("teacher"),
  addNewCategory
);
teacherRouter.put(
  "/:teacherId/verify-email/:token",
  isAuthenticated(Teacher),
  roleRestriction("teacher"),
  teacherSendEmail
);
teacherRouter.post(
  "/:teacherId/publish-blog",
  isAuthenticated(Teacher),
  roleRestriction("teacher"),
  teacherPublishBlog
);
teacherRouter.post(
  "/:teacherId/publish-advert",
  isAuthenticated(Teacher),
  roleRestriction("teacher"),
  teacherPublishAdvert
);
teacherRouter.post("/create-test", demoCreateTest);

teacherRouter.post(
  "/:teacherId/assign-homework/:studentId",
  isAuthenticated(Teacher),
  roleRestriction("teacher"),
  teacherAssignHomework
);

teacherRouter.delete("/:id/delete", deleteTeacher);
module.exports = teacherRouter;
