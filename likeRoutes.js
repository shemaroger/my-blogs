const express = require('express');
const router = express.Router();
const validateAuth = require('./middleware/validateAuth'); // middleware for authentication

// Import controllers
const { toggleLike } = require('./controller/likeController');

/**
 * @swagger
 * /blogs/{id}/comments:
 *   post:
 *     summary: Add a comment to a blog
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID to which the comment is being added
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Comment content
 *                 example: "This is a great blog!"
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.post('/blogs/:id/comments', validateAuth, addComment);

/**
 * @swagger
 * /blogs/{id}/comments:
 *   get:
 *     summary: Get all comments for a blog
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID to retrieve comments for
 *     responses:
 *       200:
 *         description: A list of comments
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.get('/blogs/:id/comments', getComments);

/**
 * @swagger
 * /blogs/{id}/like:
 *   post:
 *     summary: Toggle a like on a blog post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID to like/unlike
 *     responses:
 *       200:
 *         description: Successfully toggled like
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.post('/blogs/:id/like', validateAuth, toggleLike);

module.exports = router;