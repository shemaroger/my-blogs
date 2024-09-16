const express = require('express');
const router = express.Router();
const { addComment, getComments } = require('./controller/commentController');
const validateAuth = require('./middleware/validateAuth');

/**
 * @swagger
 * /blogs/{id}/comments:
 *   post:
 *     summary: Add a comment to a blog post
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
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the comment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Comment added successfully.
 *       400:
 *         description: Bad request, validation failed.
 *       404:
 *         description: Blog post not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/blogs/:id/comments', validateAuth, addComment);

/**
 * @swagger
 * /blogs/{id}/comments:
 *   get:
 *     summary: Retrieve all comments for a blog post
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   author:
 *                     type: string
 *                     description: The author's user ID
 *                   content:
 *                     type: string
 *                     description: The content of the comment
 *       404:
 *         description: Blog post not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/blogs/:id/comments', getComments);

module.exports = router;
