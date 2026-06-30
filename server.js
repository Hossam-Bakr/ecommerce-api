// core modules
const path = require("path");

// third party modules
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const globalErrorHandler = require("./middlewares/errorMiddleware");

//local modules
const dbConnection = require("./config/database");
const ApiError = require("./utils/ApiError");
const CategoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");

// middleware used in  configurations
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
app.set("query parser", "extended"); // { 'price[$gte]': '20', 'ratingAvg[$gte]': '2' }
dotenv.config({ path: "config.env" });
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`The application mode in : ${process.env.NODE_ENV}`);
}

// db connection
dbConnection();

// --> Mount Routes of the application
app.use("/api/v1/categories", CategoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);

app.all("/{*any}", (req, res, next) => {
  next(new ApiError(`can't find this rout : ${req.originalUrl}`, 404));
});

// Global error handling middelware
app.use(globalErrorHandler);

// --> fire the application
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (error) => {
  console.log(`UnhandledRejection Errors: ${error.name} | ${error.message}`);

  server.close(() => {
    console.log("Shutting down....");
    process.exit(1);
  });
});
