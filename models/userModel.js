const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    hashedResetCode: String,
    resetCodeExpireDate: Date,
    resetCodeVerified: Boolean,

    active: {
      type: Boolean,
      default: true,
    },

    // child refernce
    wishList: {
      type: [mongoose.Schema.ObjectId],
      ref: "Product",
      default: [],
    },

    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: {
          type: String,
          required: [true, "alias is required"],
        },
        details: {
          type: String,
          required: [true, "address details are required"],
        },
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model("User", userSchema);
module.exports = User;
