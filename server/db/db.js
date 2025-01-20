// db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE); // No additional options needed
    console.log("DB CONNECTED");
  } catch (err) {
    console.error("DB CONNECTION FAILED:", err.message);
    process.exit(1); // Exit process if the connection fails
  }
};

module.exports = connectDB;
