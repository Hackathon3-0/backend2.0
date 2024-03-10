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
//@desc Register Teacher
//@route POST /api/Utudents/registee
//@access Private

exports.registerTeacher = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const teacherFound = await Teacher.findOne({ email });
  if (teacherFound) {
    res.status(400);
    throw new Error("Teacher already exists");
  }

  //register Teacher
  const teacher = await Teacher.create({
    name,
    email,
    password: await hashPassword(password),
  });
  res.status(201).json({
    status: "success",
    message: "Teacher created successfully",
    data: teacher,
  });
});

//with .popule method u can see the what is the created details. I mean u don't see only id's.
exports.getTeacherProfile = AsyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id)
    .select("-password -createdAt -updatedAt -__v")
    .populate("blogs", "adverts", "students");
  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  } else {
    res.status(200).json({
      status: "success",
      data: teacher,
      message: "Teacher profile fetched successfully",
    });
  }
});

//@route PUT Teachers/:id/update-profile

exports.updateTeacherProfile = AsyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }
  teacher.name = req.body.name || teacher.name;
  teacher.email = req.body.email || teacher.email;
  if (req.body.password) {
    teacher.password = await hashPassword(req.body.password);
  }
  const updatedTeacher = await teacher.save();
  res.status(200).json({
    status: "success",
    data: updatedTeacher,
    message: "Teacher profile updated successfully",
  });
});

exports.getAllTeachers = AsyncHandler(async (req, res) => {
  const teachers = await Teacher.find().select("-createdAt -updatedAt -__v");
  res.status(200).json({
    status: "success",
    data: teachers,
    message: "Teachers fetched successfully",
  });
});

//@route DELETE /:id/delete

exports.deleteTeacher = AsyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }
  await teacher.deleteOne();
  res.status(200).json({
    status: "success",
    message: "Teacher deleted successfully",
  });
});

//@route PUT /Teachers/:id/add-category

exports.addNewCategory = AsyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }
  const { categories } = req.body;
  categories.forEach((category) => {
    // loop through the categories
    if (teacher.categories.includes(category)) {
      res.status(400);
      throw new Error(`Category ${category} already exists`);
    }
    teacher.categories.push(category);
  });

  const updatedTeacher = await teacher.save();
  res.status(200).json({
    status: "success",
    data: updatedTeacher,
    message: "Categories added successfully",
  });
});

//@route POST /:teacherId/publish-blog
exports.teacherPublishBlog = AsyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.teacherId);
  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }
  const { title, content } = req.body;
  const blog = await Blog.create({
    title,
    content,
    author: teacher._id,
  });
  teacher.blogs.push(blog._id);
  await teacher.save();

  // total point değeri +30 arttırılıyor.
  teacher.totalPoint += 30;
  await teacher.save();
  res.status(201).json({
    status: "success",
    data: blog,
    message: "Blog published successfully",
  });
});

//@route POST /:teacherId/publish-advert
exports.teacherPublishAdvert = AsyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.teacherId);
  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found");
  }
  const { title, description, price, categories } = req.body;
  const advert = await Advert.create({
    description,
    title,
    categories,
    price,
    teacher: teacher._id,
  });

  teacher.adverts.push(advert._id);
  await teacher.save();

  // total point değeri +20 arttırılıyor.
  teacher.totalPoint += 20;
  await teacher.save();

  res.status(201).json({
    status: "success",
    data: advert,
    message: "Advert published successfully",
  });
});

exports.demoCreateTest = AsyncHandler(async (req, res) => {
  const { testName, categories, questions } = req.body;

  // Yeni bir test oluşturun
  const newTest = new Test({
    testName,
    categories,
    questions,
  });

  // Testi kaydedin
  await newTest.save();

  res.status(201).json({ success: true, data: newTest });
});

//@route POST /:teacherId/assign-homework/:studentId
exports.teacherAssignHomework = AsyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const test = await Test.findById(req.body.testId);
  if (!test) {
    res.status(404);
    throw new Error("Test not found");
  }
  //homeworks'te testlerin id'leri tutuluyor.
  student.homeworks.push(test._id);
  await student.save();

  res.status(200).json({
    status: "success",
    data: student,
    message: "Homework assigned successfully",
  });
});
