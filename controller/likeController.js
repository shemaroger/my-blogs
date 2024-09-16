const Blog = require('../Models/Blogs');

exports.toggleLike = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Find the blog post by ID
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Get the current user's ID
        const userId = req.user._id.toString(); // Ensure userId is a string

        // Check if the user has already liked the blog
        if (blog.likes.includes(userId)) {
            // User has liked the blog, so we remove the like
            blog.likes = blog.likes.filter(id => id.toString() !== userId);
            await blog.save();
            return res.status(200).json({ message: 'Blog unliked', likes: blog.likes.length });
        } else {
            // User has not liked the blog, so we add the like
            blog.likes.push(userId);
            await blog.save();
            return res.status(200).json({ message: 'Blog liked', likes: blog.likes.length });
        }

    } catch (err) {
        console.error('Error updating like status:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
