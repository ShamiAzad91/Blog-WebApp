const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const paragraphsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
      imageUrl: {
        type: String,
        required: true,
      },
})


const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  category: { type: String, required: true},
  paragraphs: {
    type: [paragraphsSchema],
    default: [],
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  }
},{timestamps:true});

module.exports = mongoose.model("Blog", blogSchema);
