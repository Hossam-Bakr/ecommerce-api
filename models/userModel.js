const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "the name is required "],
      minLength: [2, "too short name "],
      maxLength: [20, "too long name "],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: [true, "the email must be unique "],
      required: [true, "email is required "],
    },
    phone: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "password is required "],
      minLength: [6, "too short password "],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestmaps: true },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
