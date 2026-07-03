const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const factory = require("./factoryHandler");
const { uuid } = require("uuidv4");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadImages");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");

/**
 * @desc    Upload single user profile image
 * @route   Middleware for user create/update routes
 * @access  Private - Admin on create, Admin/Manager on update
 */
exports.uploadImageMiddleWare = uploadSingleImage("profileImg");

/**
 * @desc    Resize and save uploaded user profile image
 * @route   Middleware for user create/update routes
 * @access  Private - Admin on create, Admin/Manager on update
 */
exports.imageProccess = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `User-${uuid()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .toFormat("jpeg")
      .resize({ width: 600, height: 600 })
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);

    req.body.image = filename;
  }
  next();
});

/**
 * @desc    Get all users with pagination
 * @route   GET /api/v1/users
 * @access  Private - Admin, Manager
 */
exports.getUsers = factory.getAll(User);

/**
 * @desc    Get specific user by id
 * @route   GET /api/v1/users/:id
 * @access  Private - Admin, Manager
 */
exports.getUser = factory.getOne(User);

/**
 * @desc    Create a new user
 * @route   POST /api/v1/users
 * @access  Private - Admin
 */
exports.createUser = factory.createOne(User);

/**
 * @desc    Update specific user by id
 * @route   PUT /api/v1/users/:id
 * @access  Private - Admin, Manager
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
      role: req.body.profileImg,
    },
    { new: true },
  );

  if (!document) {
    return next(new ApiError(`there is no document with this id :${id} `, 404));
  }

  res.status(200).json({ data: document });
});

/**
 * @desc    Change specific user password by id
 * @route   PUT /api/v1/users/changePassword/:id
 * @access  Private - Admin, Manager
 */
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true },
  );

  if (!document) {
    return next(
      new ApiError(`there is no document with this id :${req.params.id} `, 404),
    );
  }

  res.status(200).json({ data: document });
});

/**
 * @desc    Delete specific user by id
 * @route   DELETE /api/v1/users/:id
 * @access  Private - Admin, Manager
 */
exports.deleteUser = factory.deleteOne(User);

/**
 * @desc    Set logged user id into params for reuse
 * @route   GET /api/v1/users/getMe
 * @access  Private - Logged in users
 */
exports.getLoggedUserData = asyncHandler((req, res, next) => {
  req.params.id = req.user._id;
  next();
});

/**
 * @desc    Change logged user password
 * @route   PUT /api/v1/users/changeMyPassword
 * @access  Private - Logged in users
 */
exports.changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true },
  );

  if (!user) {
    return next(
      new ApiError(`there is no user with this id :${user._id} `, 404),
    );
  }

  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

/**
 * @desc    Update logged user data
 * @route   PUT /api/v1/users/updateMe
 * @access  Private - Logged in users
 */
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true },
  );

  if (!user) {
    return next(
      new ApiError(`there is no user with this id :${user._id} `, 404),
    );
  }

  res.status(200).json({ data: user });
});

/**
 * @desc    Deactivate logged user account
 * @route   PUT /api/v1/users/deActiveMyProfile
 * @access  Private - Logged in users
 */
exports.deActivateLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ status: "success" });
});
