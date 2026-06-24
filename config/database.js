const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`Database connected successfully : ${conn.connection.host}`);
  });
  // .catch((err) => {
  //   console.log(process.env.DB_URI);
  //   console.log(`Database connection failed : ${err.message}`);
  // });
};

module.exports = dbConnection;
