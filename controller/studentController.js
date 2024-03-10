const AsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
dotenv.config();
const Student = require("../model/Student");
const generateToken = require("../utils/generateToken");
const { hashPassword, isPasswordMatched } = require("../utils/helpers");
const Teacher = require("../model/Teacher");
const Blog = require("../model/Blog");
const Advert = require("../model/Advert");
//@desc Register Utudent
//@route POST /api/Utudents/registee
//@access Private

exports.registerStudent = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const studentFound = await Student.findOne({ email });
  if (studentFound) {
    res.status(400);
    throw new Error("Student already exists");
  }

  //register Student
  const student = await Student.create({
    name,
    email,
    password: await hashPassword(password),
  });
  res.status(201).json({
    status: "success",
    message: "Student created successfully",
    data: student,
  });
});

//with .popule method u can see the what is the created details. I mean u don't see only id's.
exports.getStudentProfile = AsyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .select("-password -createdAt -updatedAt -__v")
    .populate("teachers", "homeworks");
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  } else {
    res.status(200).json({
      status: "success",
      data: student,
      message: "Student profile fetched successfully",
    });
  }
});

//@route PUT students/:id/update-profile

exports.updateStudentProfile = AsyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error("student not found");
  }
  student.name = req.body.name || student.name;
  student.email = req.body.email || student.email;
  if (req.body.password) {
    student.password = await hashPassword(req.body.password);
  }
  const updatedStudent = await student.save();
  res.status(200).json({
    status: "success",
    data: updatedStudent,
    message: "student profile updated successfully",
  });
});

exports.getAllStudents = AsyncHandler(async (req, res) => {
  const students = await Student.find().select("-createdAt -updatedAt -__v");
  res.status(200).json({
    status: "success",
    data: students,
    message: "Students fetched successfully",
  });
});

//@route DELETE /:id/delete

exports.deleteStudent = AsyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }
  await student.remove();
  res.status(200).json({
    status: "success",
    message: "Student deleted successfully",
  });
});

//@route PUT /students/:id/add-category

exports.addNewCategory = AsyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }
  const { categories } = req.body;
  categories.forEach((category) => {
    // loop through the categories
    if (student.categories.includes(category)) {
      res.status(400);
      throw new Error(`Category ${category} already exists`);
    }
    student.categories.push(category);
  });

  const updatedStudent = await student.save();
  res.status(200).json({
    status: "success",
    data: updatedStudent,
    message: "Category added successfully",
  });
});

//@route PUT /students/:id/add-min-time

exports.addMinTime = AsyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }
  const { minTime } = req.body;
  student.minTime = minTime;
  const updatedStudent = await student.save();
  res.status(200).json({
    status: "success",
    data: updatedStudent,
    message: "Minimum time added successfully",
  });
});

//@route PUT /:studentId/:teacherId/student-choose-teacher
exports.studentChoicesTeacher = AsyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }
  const { teacherId } = req.params;
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }
  //push the teacherId to the student's teachers array
  student.teachers.push(teacherId);
  teacher.totalPoint += 50;
  const updatedStudent = await student.save();
  //push the studentId to the teacher's students array
  teacher.students.push(student._id);
  teacher.totalPoint += 50;
  await teacher.save();

  res.status(200).json({
    status: "success",
    data: updatedStudent,
    message: "Teacher added successfully",
  });
});

//@route PUT /students/:id/student-complete-task
exports.studentCompleteTask = AsyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  student.totalPoint += 15;
  const updatedStudent = await student.save();
  res.status(200).json({
    status: "success",
    data: updatedStudent,
    message: "Task completed successfully",
  });
});

//@route PUT /students/:studentId/student-complete-homework/:homeworkId
exports.studentCompleteHomework = AsyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }
  student.homeworks.remove(req.params.homeworkId);
  student.totalPoint += 25;
  const updatedStudent = await student.save();
  res.status(200).json({
    status: "success",
    data: updatedStudent,
    message: "Task completed successfully",
  });
});

//@route PUT /students/:studentId/student-rate-teacher/:teacherId
exports.studentRateTeacher = AsyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const teacher = await Teacher.findById(req.params.teacherId);
  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }

  const { score } = req.body;
  teacher.ratings.push({ student: student._id, score });
  teacher.averageRating =
    teacher.ratings.reduce((acc, curr) => acc + curr.score, 0) /
    teacher.ratings.length;
  await teacher.save();

  res.status(200).json({
    status: "success",
    data: teacher,
    message: "Student rated teacher succesfully",
  });
});

//@route PUT /students/:studentId/student-like-blog/:blogId
exports.studentLikeBlog = AsyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const blog = await Blog.findById(req.params.blogId);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  // Check if the student has already liked the blog
  if (blog.likes.includes(student._id)) {
    res.status(400);
    throw new Error("Blog already liked by the student");
  }

  // Add the student to the blog's likes
  blog.likes.push(student._id);
  await blog.save();

  res.status(200).json({
    status: "success",
    data: blog,
    message: "Student liked the blog successfully",
  });
});

//@route PUT /students/:studentId/student-dislike-blog/:blogId
exports.studentDislikeBlog = AsyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const blog = await Blog.findById(req.params.blogId);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  // Check if the student has already disliked the blog
  if (blog.dislikes.includes(student._id)) {
    res.status(400);
    throw new Error("Blog already disliked by the student");
  }

  // Remove the student from the blog's likes if exists
  const index = blog.likes.indexOf(student._id);
  if (index > -1) {
    blog.likes.splice(index, 1);
  }

  // Add the student to the blog's dislikes
  blog.dislikes.push(student._id);
  await blog.save();

  res.status(200).json({
    status: "success",
    data: blog,
    message: "Student disliked the blog successfully",
  });
});

//@route GET /students/get-all-blogs

exports.getAllBlogs = AsyncHandler(async (req, res) => {
  const blogs = await Blog.find().select("-createdAt -updatedAt -__v");
  res.status(200).json({
    status: "success",
    data: blogs,
    message: "Blogs fetched successfully",
  });
});

//@route GET /students/get-all-adverts

exports.getAllAdverts = AsyncHandler(async (req, res) => {
  const adverts = await Advert.find().select("-createdAt -updatedAt -__v");
  res.status(200).json({
    status: "success",
    data: adverts,
    message: "Adverts fetched successfully",
  });
});
