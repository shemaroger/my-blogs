const Post = require('../Models/Blogs');
const Comments = require('../Models/Coments');
const cloudinary = require('../cloudinary');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Blog validation schema
const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    author: Joi.string().required(),
});

// Create Blog
exports.createBlog = async (req, res) => {
    try {
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { title, content, author } = req.body;
        const post = new Post({ title, content, author });
        await post.save();
        return res.status(201).json(post);
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Upload Image to Blog
exports.uploadImageToBlog = async (req, res) => {
    if (!req.file) return res.status(400).json({ err: 'Please select an image' });

    try {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: "Posts" });
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.image = result.secure_url;
        post.public_id = result.public_id;
        await post.save();
        await fs.unlink(req.file.path);

        return res.status(200).json({
            message: 'Image uploaded successfully',
            id: post._id,
            image: post.image,
        });
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get All Blogs
exports.getBlogs = async (req, res) => {
    try {
        const posts = await Post.find();
        return res.status(200).json(posts);
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get Blog by ID
exports.getBlogById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Blog not found' });
        return res.status(200).json(post);
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update Blog
exports.updateBlog = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Blog not found' });

        const { title, content } = req.body;
        if (title) post.title = title;
        if (content) post.content = content;

        await post.save();
        return res.status(200).json(post);
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
    try {
        const result = await Post.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Blog not found' });
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Create Comment
exports.createComment = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, 'secret_key0987');
        const userId = decoded.id;

        const { like = 0, comment } = req.body;
        const newComment = new Comments({
            like,
            blog_id: req.params.blog_id,
            user_id: userId,
            comment,
        });

        await newComment.save();
        return res.status(201).json(newComment);
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update Like on Comment
exports.updateLike = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, 'secret_key0987');
        const userId = decoded.id;
        const { like } = req.body;

        if (typeof like !== 'number' || like < 0) {
            return res.status(400).json({ error: 'Invalid like value' });
        }

        const comment = await Comments.findOneAndUpdate(
            { _id: req.params.comment_id, user_id: userId },
            { like },
            { new: true }
        );

        if (!comment) return res.status(404).json({ error: 'Comment not found or unauthorized' });

        return res.status(200).json(comment);
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get Comments by Blog ID
exports.getCommentsByBlogId = async (req, res) => {
    try {
        const comments = await Comments.find({ blog_id: req.params.blog_id }).populate('user_id', 'email');
        if (!comments || comments.length === 0) return res.status(404).json({ error: 'No comments found for this blog' });
        return res.status(200).json(comments);
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
