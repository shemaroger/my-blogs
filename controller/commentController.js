const Blog = require('../Models/Blogs');
const Joi = require('joi');

// Joi schema for validating comment
const commentSchema = Joi.object({
    content: Joi.string().required(),
});

exports.addComment = async (req, res) => {
    const { error } = commentSchema.validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    try {
        // Log the token and decoded user
        console.log("Authorization header:", req.headers.authorization);
        console.log("Decoded user:", req.user); // This should have the user ID and other info

        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
        }

        const { content } = req.body;
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        blog.comments.push({ content, author: req.user.id });
        await blog.save();

        res.status(201).json({ message: 'Comment added successfully', comment: { content, author: req.user.id } });
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
};

// Get all comments for a blog
exports.getComments = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('comments.author', 'email');
        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        res.status(200).json(blog.comments);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
