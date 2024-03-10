const express = require("express");
const {
  notFoundErr,
  globalErrHandler,
} = require("../middlewares/globalErrHandler");
const studentRouter = require("../routes/studentRouter");
const teacherRouter = require("../routes/teacherRouter");
const authController = require("../controller/authController");
const openaiControlller = require("../controller/openaiController");
//app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.post("/api/v1/chat-with-gpt", openaiControlller.chatWithGPT3);
app.post("/api/v1/login", authController.login);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/teachers", teacherRouter);

// Error Handler
app.use(notFoundErr);
app.use(globalErrHandler);

module.exports = app;
