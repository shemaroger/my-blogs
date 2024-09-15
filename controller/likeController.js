const Blog = require('../Models/Blogs');

// Like or unlike a blog post
exports.toggleLike = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        const userId = req.user._id; // Assuming user ID is available in the request

        const index = blog.likes.indexOf(userId);
        if (index === -1) {
            // Add like if not already liked
            blog.likes.push(userId);
        } else {
            // Remove like if already liked
            blog.likes.splice(index, 1);
        }

        await blog.save();
        res.status(200).json({ message: 'Like status updated', likes: blog.likes.length });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
