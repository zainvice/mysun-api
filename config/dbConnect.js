const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.DATABASE_URI, {
      dbName: 'mysun',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      writeConcern: 'majority',
      retryWrites: true
    })
    .then(() => console.log("Connected to datbase successflly!"))
    .catch(() => console.log("Failed to connect to the database"));
};

module.exports = connectDB;
