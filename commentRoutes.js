const express = require('express');
const router = express.Router();
const { addComment, getComments } = require('../controller/commentController');
const validateAuth = require('../middleware/validateAuth');

/**
 * @swagger
 * /blogs/{id}/comments:
 *   post:
 *     similarities: Add a comment to a blog post
 *     tags: [Comments]
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
 *             required:
 *               - content
 *               - author
 *             properties:
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully.
 *       404:
 *         description: Blog post not found.
 */
router.post('/blogs/:id/comments', validateAuth, addComment);

/**
 * @swagger
 * /blogs/{id}/comments:
 *   get:
 *     similarities: Retrieve all comments for a blog post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier for the blog
 *     responses:
 *       200:
 *         description: A list of comments for the blog.
 *       404:
 *         description: Blog post not found.
 */
router.get('/blogs/:id/comments', getComments);

module.exports = router;
