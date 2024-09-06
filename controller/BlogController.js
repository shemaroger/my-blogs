const Post = require('../Models/Blogs');
const Comments = require('../Models/Coments');
const cloudinary = require('../cloudinary');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    author: Joi.string().required(),
});

// Create Blog
exports.createBlog = async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    const { title, content, author } = req.body;
    const post = new Post({ title, content, author });
    await post.save();
    res.status(201).send(post);
};

// Upload Image to Blog
exports.uploadImageToBlog = async (req, res) => {
    if (!req.file) return res.status(400).json({ err: 'Please select an image' });

    const result = await cloudinary.uploader.upload(req.file.path, { folder: "Posts" });
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.image = result.secure_url;
    post.public_id = result.public_id;
    await post.save();
    await fs.unlink(req.file.path);

    res.status(200).json({
        message: 'Image uploaded successfully',
        id: post._id,
        image: post.image,
    });
};

// Get All Blogs
exports.getBlogs = async (req, res) => {
    const posts = await Post.find();
    res.send(posts);
};

// Get Blog by ID
exports.getBlogById = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send({ error: "Blog not found" });
    res.send(post);
};

// Update Blog
exports.updateBlog = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send({ error: "Blog not found" });

    if (req.body.title) post.title = req.body.title;
    if (req.body.content) post.content = req.body.content;

    await post.save();
    res.send(post);
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
    const result = await Post.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send({ error: "Blog not found" });
    res.status(204).send();
};

// Create Comment
exports.createComment = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).send({ error: "No token provided" });

    const decoded = jwt.verify(token, 'secret_key0987');
    const userId = decoded.id;

    const comment = new Comments({
        like: req.body.like || 0,
        blog_id: req.params.blog_id,
        user_id: userId,
        comment: req.body.comment,
    });

    await comment.save();
    res.status(201).send(comment);
};

// Update Like on Comment
exports.updateLike = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).send({ error: "No token provided" });

    const decoded = jwt.verify(token, 'secret_key0987');
    const userId = decoded.id;

    const { comment_id } = req.params;
    const { like } = req.body;

    if (typeof like !== 'number' || like < 0) {
        return res.status(400).send({ error: "Invalid like value" });
    }

    const comment = await Comments.findOneAndUpdate(
        { _id: comment_id, user_id: userId },
        { like },
        { new: true }
    );

    if (!comment) return res.status(404).send({ error: "Comment not found or not authorized" });

    res.send(comment);
};

// Get Comments by Blog ID
exports.getCommentsByBlogId = async (req, res) => {
    const comments = await Comments.find({ blog_id: req.params.blog_id }).populate('user_id', 'email');
    if (!comments || comments.length === 0) return res.status(404).send({ error: "No comments found for this blog" });
    res.send(comments);
};
