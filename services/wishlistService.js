const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

/**
 * @desc    add product to wishlist
 * @route   POST /api/v1/wishlist
 * @access  __protected - user
 */
exports.addProductToWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishList: req.body.productId } },
    { new: true },
  );
  res.status(200).json({
    status: "success",
    message: "product added successfully to your wishlist",
    data: user.wishList,
  });
});

/**
 * @desc    delete  product from wishlist
 * @route   delete  /api/v1/wishlist/:productId
 * @access  __protected - user
 */
exports.removeProductToWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishList: req.params.productId } },
    { new: true },
  );
  res.status(200).json({
    status: "success",
    message: "product deleted successfully from your wishlist",
    data: user.wishList,
  });
});

/**
 * @desc    get logged user wishlist
 * @route   get  /api/v1/wishlist/
 * @access  __protected - user
 */
exports.getLoggedUserWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishList");
  res.status(200).json({
    status: "success",
    wishListResults: user.wishList.length,
    data: user,
  });
});
