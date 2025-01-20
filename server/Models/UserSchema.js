const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  blogs: {
    type: Array,
    default: [],
  },
},{timestamps:true});

// Pre-save hook to hash the password
userSchema.pre("save", async function (next) {
  const user = this; // `this` refers to the current document
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8); // Hash the password
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
