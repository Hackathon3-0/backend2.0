const mongoose = require("mongoose");
const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    ratings: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
        score: Number,
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      max: 5,
    },
    role: {
      type: String,
      default: "teacher",
    },
    adverts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Advert",
      },
    ],
    categories: {
      type: [String],
      enum: [
        "Yazılım",
        "Genel Kültür",
        "Genel Yetenek",
        "Hızlı Okuma",
        "Hafıza Egzersizleri",
        "Matematik",
        "Fizik",
        "Kimya",
        "Biyoloji",
        "Tarih",
        "Coğrafya",
        "Edebiyat",
        "Felsefe",
        "Din Kültürü",
        "İngilizce",
        "Almanca",
      ],
      default: [],
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    totalPoint: {
      type: Number,
      default: 0,
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;
