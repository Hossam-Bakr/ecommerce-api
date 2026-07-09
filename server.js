// core modules
const path = require("path");

// third party modules
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const morgan = require("morgan");
const globalErrorHandler = require("./middlewares/errorMiddleware");
const cors = require("cors");
const compression = require("compression");

//local modules
const dbConnection = require("./config/database");
const ApiError = require("./utils/ApiError");

const mountRoutes = require("./routes");

const app = express();
app.use(cors());
app.use(compression());
// app.options("*", cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
app.set("query parser", "extended"); // { 'price[$gte]': '20', 'ratingAvg[$gte]': '2' }
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`The application mode in : ${process.env.NODE_ENV}`);
}

dbConnection();

mountRoutes(app);
app.all("/{*any}", (req, res, next) => {
  next(new ApiError(`can't find this rout : ${req.originalUrl}`, 404));
});

// Global error handling middelware
app.use(globalErrorHandler);

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
