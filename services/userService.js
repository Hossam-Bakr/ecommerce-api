const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const factory = require("./factoryHandler");
const { uuid } = require("uuidv4");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadImages");

exports.imageProccess = asyncHandler(async (req, res, next) => {
  const filename = `User-${uuid()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .toFormat("jpeg")
    .resize({ width: 600, height: 600 })
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${filename}`);
  // save the image name into db
  req.body.image = filename;
  next();
});

exports.uploadImageMiddleWare = uploadSingleImage("profileImg");

//--> desc      get all  Users with pagination
//--> route     GET /api/v1/users
//--> access    private
exports.getUsers = factory.getAll(User);

//--> desc      get specific user
//--> route     GET /api/v1/users/:id
//--> access    private
exports.getUser = factory.getOne(User);

//--> desc      create user
//--> route     POST /api/v1/users
//--> access    private
exports.createUser = factory.createOne(User);

//--> desc      update specific user
//--> route     PUT /api/v1/users/:id
//--> access    private

exports.updateUser = factory.updateOne(User);

//--> desc      delete specific user
//--> route     DELETE  /api/v1/users/:id
//--> access    private
exports.deleteUser = factory.deleteOne(User);
