const multer = require("multer");
const ApiError = require("../utils/ApiError");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("only images allowed ", 400), false);
    }
  };
  // return upload
  return multer({ storage: multerStorage, fileFilter: multerFilter });
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (fieldsArray) =>
  multerOptions().fields(fieldsArray);

/**
 * 
 * the disk storage 
  
  const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/categories");
    },

    filename: function (req, file, cb) {
      const extention = file.mimetype.split("/")[1];
      const filename = `category-${uuid()}-${Date.now()}.${extention}`;
      cb(null, filename);
    },
  });


 * 
 * 
 * 
 * 
 */
