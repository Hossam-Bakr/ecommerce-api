const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: [3, "The title is too short"],
      maxlength: [100, "The title is too long"],
      trim: true,
      required: [true, "The title of the product is required"],
    },

    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      minlength: [20, "The description is too short"],
      maxlength: [2000, "The description is too long"],
      trim: true,
      required: [true, "The description of the product is required"],
    },

    price: {
      type: Number,
      min: [1, "Product price must be greater than or equal to 1"],
      required: [true, "The product price is required"],
    },

    priceAfterDiscount: {
      type: Number,
      min: [1, "Price after discount must be greater than or equal to 1"],
      validate: {
        validator: function (value) {
          return value == null || value < this.price;
        },
        message: "Price after discount must be lower than the original price",
      },
    },

    sold: {
      type: Number,
      default: 0,
      min: [0, "Sold value must be greater than or equal to 0"],
    },

    availableQuantity: {
      type: Number,
      required: [true, "The available quantity of the product is required"],
      min: [0, "The available quantity must be greater than or equal to 0"],
    },

    colors: [
      {
        type: String,
        trim: true,
      },
    ],

    imagesOfProduct: [
      {
        type: String,
        trim: true,
      },
    ],

    imageCover: {
      type: String,
      required: [true, "The image cover is required"],
      trim: true,
    },

    ratingAvg: {
      type: Number,
      min: [1, "The rating average must be between 1 and 5"],
      max: [5, "The rating average must be between 1 and 5"],
      default: 1,
    },

    numberOfRatings: {
      type: Number,
      min: [0, "The number of ratings must be greater than or equal to 0"],
      default: 0,
    },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "The product must belong to a category"],
    },

    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],

    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
  },
  { timestamps: true },
);

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.image}`;
    doc.image = imageUrl;
  }
  if (doc.imagesOfProduct) {
    const imagesList = [];
    doc.imagesOfProduct.forEach((element) => {
      const imageUrl = `${process.env.BASE_URL}/products/${element}`;
      imagesList.push(imageUrl);
    });
    doc.imagesOfProduct = imagesList;
  }
};

// this working on findOne , findAll and  update
productSchema.post("init", function (doc) {
  setImageUrl(doc);
});
// this working create
productSchema.post("save", function (doc) {
  setImageUrl(doc);
});

module.exports = mongoose.model("Product", productSchema);
