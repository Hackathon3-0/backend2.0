const mongoose = require("mongoose");

const advertSchema = new mongoose.Schema(
  {
    title: {
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
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Advert = mongoose.model("Advert", advertSchema);

module.exports = Advert;
