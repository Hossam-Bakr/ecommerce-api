const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
dotenv.config({ path: "config.env" });
const CategoryRoute = require("./Routes/CategoryRoute");
const dbConnection = require("./config/database");
const ApiError = require("./utils/ApiError");
const globalErrorHandler = require("./middlewares/errorMiddleware");

const app = express();
// --> .env file configuration
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`The application mode in : ${process.env.NODE_ENV}`);
}

// --> database connection
dbConnection();

// middlewares
app.use(express.json());

// --> Mount Routes of the application
app.use("/api/v1/categories", CategoryRoute);

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
