const Blog = require('../Models/Blogs');
const Joi = require('joi');

const commentSchema = Joi.object({
    content: Joi.string().required(),
    author: Joi.string().required(),
});

// Add a comment to a blog post
exports.addComment = async (req, res) => {
    const { error } = commentSchema.validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    try {
        const { content, author } = req.body;
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        blog.comments.push({ content, author });
        await blog.save();

        res.status(201).json({ message: 'Comment added successfully', blog });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
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
