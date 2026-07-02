const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    throw new Error(new ApiError("invalid email or password !", 401));
  }
  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  // check if there is a token and get it
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(
      new ApiError(
        "your are not logged in , please login to can access this route ",
      ),
    );
  }

  //check token (no changes happened in token  && expire date )
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // check if the user still exists or not
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError("this token belongs to user does not longer exists  ", 401),
    );
  }

  // check if the password changed after the token initialized
  if (currentUser.passwordChangedAt) {
    const passwordChangedAtTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );
    // password changed ==> error
    if (passwordChangedAtTimeStamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password , please login again ",
          401,
        ),
      );
    }
  }
  req.user = currentUser;
  next();
});
