const express = require('express');
const router = express.Router();
const likeController = require('../controller/likeController');
const { validateAuth } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /{blogId}/likes:
 *   post:
 *     summary: Toggle like or unlike a specific blog post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier for the blog post
 *     responses:
 *       200:
 *         description: Like status successfully toggled.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 liked:
 *                   type: boolean
 *                   description: Indicates if the blog post is liked (true) or unliked (false).
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       400:
 *         description: Invalid input or request data.
 *       401:
 *         description: Unauthorized request.
 *       404:
 *         description: Blog post not found.
 */

router.post('blogs/:blogId/likes', validateAuth, likeController.toggleLike);

module.exports = router;
