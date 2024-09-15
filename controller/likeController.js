const Blog = require('../Models/Blogs');

exports.toggleLike = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        const userId = req.user._id;

        const index = blog.likes.indexOf(userId);
        if (index === -1) {
            blog.likes.push(userId);
        } else {
            blog.likes.splice(index, 1);
        }

        await blog.save();
        res.status(200).json({ message: 'Like status updated', likes: blog.likes.length });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};