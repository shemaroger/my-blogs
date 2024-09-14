const express = require('express');
const router = express.Router();
const commentController = require('../controller/commentController');
const { validateAuth } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /{blogId}/comments:
 *   post:
 *     summary: Add a comment to a specific blog post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier for the blog post
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
 *     responses:
 *       201:
 *         description: Comment successfully added.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Unauthorized request.
 *       404:
 *         description: Blog post not found.
 */

/**
 * @swagger
 * /{blogId}/comments:
 *   get:
 *     summary: Retrieve all comments for a specific blog post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier for the blog post
 *     responses:
 *       200:
 *         description: A list of comments for the specified blog post.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   author:
 *                     type: string
 *       404:
 *         description: Blog post not found.
 */

router.post('blogs/:blogId/comments', validateAuth, commentController.addComment);
router.get('blogs/:blogId/comments', commentController.getComments);

module.exports = router;

