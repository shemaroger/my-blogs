const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  image: {
    type: String,
    default: '',
  },
   date: {
    type: Date,
    default: Date.now,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    date: {
      type: Date,
      default: Date.now,
    },
  }],
  
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
