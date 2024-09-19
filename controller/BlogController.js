const Post = require('../Models/Blogs');
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
    if (!req.file) return res.status(400).json({ error: 'No image file uploaded' });

    try {
        console.log('Received image upload request');
        console.log('File details:', req.file);

        // Upload image to Cloudinary
        let result;
        try {
            result = await cloudinary.uploader.upload(req.file.path, { folder: 'Posts' });
            console.log('Cloudinary upload result:', result); // Log the Cloudinary result
        } catch (uploadErr) {
            console.error('Error uploading to Cloudinary:', uploadErr);
            return res.status(500).json({ error: 'Failed to upload image to Cloudinary', details: uploadErr.message });
        }

        // Find the post by ID
        const post = await Post.findById(req.params.id);
        if (!post) {
            console.error('Post not found:', req.params.id);
            return res.status(404).json({ message: 'Post not found' });
        }

        // Update post with image URL and Cloudinary public ID
        post.image = result.secure_url;
        post.public_id = result.public_id;

        // Save post with image URL
        try {
            await post.save();
            console.log('Image URL saved to post:', post.image);
        } catch (saveErr) {
            console.error('Error saving post with image URL:', saveErr);
            return res.status(500).json({ error: 'Failed to save post with image URL', details: saveErr.message });
        }

        // Remove the file from local uploads folder
        try {
            await fs.unlink(req.file.path);
            console.log('Local file removed:', req.file.path);
        } catch (unlinkErr) {
            console.error('Error removing local file:', unlinkErr);
            // Log the error but don't return it to avoid interfering with the success response
        }

        res.status(200).json({
            message: 'Image uploaded successfully',
            id: post._id,
            image: post.image,
        });
    } catch (err) {
        console.error('Error in uploadImageToBlog function:', err); // Log the full error
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
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
    if (req.body.author) post.author = req.body.author;

    await post.save();
    res.send(post);
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
    const result = await Post.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send({ error: "Blog s not found" });
    res.status(204).send();
};
