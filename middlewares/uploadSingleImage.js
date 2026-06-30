const multer = require("multer");
const ApiError = require("../utils/ApiError");

exports.uploadSingleImage = (fieldName) => {
  //1- prepare the storate   ==> disk storage | memory storage
  const multerStorage = multer.memoryStorage();
  // 2- prepare the filter of uploaded files    ==> images | files
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("only images allowed ", 400), false);
    }
  };
  // 3- upload image of the category
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload.single(fieldName);
};

// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },

//   filename: function (req, file, cb) {
//     const extention = file.mimetype.split("/")[1];
//     const filename = `category-${uuid()}-${Date.now()}.${extention}`;
//     cb(null, filename);
//   },
// });
