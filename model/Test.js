const mongoose = require("mongoose");
const TestSchema = new mongoose.Schema(
  {
    testName: {
      type: String,
      required: true,
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
      required: true,
    },
    questions: [
      {
        questionText: {
          type: String,
          required: true,
        },
        choices: [
          {
            type: String,
            required: true,
          },
        ],
        answer: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Test = mongoose.model("Test", TestSchema);
module.exports = Test;
