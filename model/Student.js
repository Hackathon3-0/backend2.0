const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema(
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
    role: {
      type: String,
      default: "student",
    },
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
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
    minTime: {
      type: Number,
      default: 0,
    },
    completedDays: {
      type: Array,
      default: [],
    },
    completedCategories: {
      type: [
        {
          category: {
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
          },
          completedTest: {
            type: Number,
            default: 0,
          },
        },
      ],
      default: [],
    },
    totalPoint: {
      type: Number,
      default: 0,
    },
    homeworks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
      },
    ],
    dailyTasks: [
      {
        type: String,
        enum: ["AI", "Test çöz", "Makale oku", "Makale beğen"],
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
