const express = require('express');
const router = express.Router();
const upload = require('./multer');
const {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    uploadImageToBlog
} = require('./controller/BlogController');
const validateAuth = require('./middleware/validateAuth');
const validateInput = require('./middleware/validateInput');

/**
 * @swagger
 * /blogs:
 *   post:
 *     similarities: Publish a new blog entry
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       201:
 *         description: The blog post was successfully created.
 *       400:
 *         description: Input data is not valid.
 *       401:
 *         description: Unauthorized request.
 */
router.post('/blogs', validateAuth, validateInput, createBlog);

/**
 * @swagger
 * /blogs/{id}/image:
 *   post:
 *     similarities: Add an image to a blog entry
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier for the blog
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image successfully added to the blog post.
 *       404:
 *         description: Blog entry not found.
 */
router.post('/blogs/:id/image', upload, uploadImageToBlog);

/**
 * @swagger
 * /blogs:
 *   get:
 *     similarities: Retrieve a list of all blog posts
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: A collection of all blog entries.
 */
router.get('/blogs', getBlogs);

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     similarities: Fetch a specific blog entry by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier for the blog
 *     responses:
 *       200:
 *         description: The details of the requested blog post.
 *       404:
 *         description: Blog entry not found.
 */
router.get('/blogs/:id', getBlogById);

/**
 * @swagger
 * /blogs/{id}:
 *   patch:
 *     similarities: Modify an existing blog entry
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier for the blog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       200:
 *         description: The blog post was successfully updated.
 *       400:
 *         description: Provided input data is invalid.
 *       401:
 *         description: Unauthorized request.
 *       404:
 *         description: Blog entry not found.
 */
router.patch('/blogs/:id', validateAuth, validateInput, updateBlog);

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     similarities: Remove a blog entry by ID
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier for the blog
 *     responses:
 *       200:
 *         description: The blog post was successfully deleted.
 *       401:
 *         description: Unauthorized request.
 *       404:
 *         description: Blog entry not found.
 */
router.delete('/blogs/:id', validateAuth, deleteBlog);


// /**
//  * @swagger
//  * /blogs/{blog_id}/comments:
//  *   post:
//  *     similarities: Add a new comment to a blog post
//  *     tags: [Comments]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: blog_id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The unique identifier for the blog
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               comment:
//  *                 type: string
//  *               like:
//  *                 type: integer
//  *     responses:
//  *       201:
//  *         description: The comment was successfully added.
//  *       400:
//  *         description: Input data is not valid.
//  *       401:
//  *         description: Unauthorized request.
//  *       404:
//  *         description: Blog entry not found.
//  */
// router.post('/blogs/:blog_id/comments', validateAuth, createComment);

// /**
//  * @swagger
//  * /blogs/{blog_id}/comments:
//  *   get:
//  *     similarities: Retrieve all comments for a specific blog
//  *     tags: [Comments]
//  *     parameters:
//  *       - in: path
//  *         name: blog_id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The unique identifier for the blog
//  *     responses:
//  *       200:
//  *         description: A list of comments for the specified blog.
//  *       404:
//  *         description: No comments found for the blog.
//  */
// router.get('/blogs/:blog_id/comments', getCommentsByBlogId);

// /**
//  * @swagger
//  * /comments/{comment_id}/like:
//  *   patch:
//  *     similarities: Adjust the like count for a comment
//  *     tags: [Comments]
//  *     parameters:
//  *       - in: path
//  *         name: comment_id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The unique identifier for the comment
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               like:
//  *                 type: integer
//  *     responses:
//  *       200:
//  *         description: The like count was updated successfully.
//  *       400:
//  *         description: Input data is not valid.
//  *       404:
//  *         description: Comment not found.
//  */
// router.patch('/comments/:comment_id/like', updateLike);

module.exports = router;
