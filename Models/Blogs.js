const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: String,
  },
 comments: [commentSchema], // Added comments field
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Added likes field
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
