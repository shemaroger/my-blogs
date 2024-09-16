const express = require('express');
const router = express.Router();
const { toggleLike, getLikesCount } = require('./controller/likeController');
const validateAuth = require('./middleware/validateAuth');

/**
 * @swagger
 * /blogs/{id}/like:
 *   post:
 *     summary: Like or unlike a blog post
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier for the blog
 *     responses:
 *       200:
 *         description: Like status updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Blog liked' # Single example, can be 'Blog unliked' depending on the action
 *                 likes:
 *                   type: integer
 *                   example: 10
 *       401:
 *         description: Unauthorized. User needs to be authenticated.
 *       404:
 *         description: Blog post not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/blogs/:id/like', validateAuth, toggleLike);

/**
 * @swagger
 * /blogs/{id}/likes:
 *   get:
 *     summary: Get the number of likes for a blog post
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier for the blog
 *     responses:
 *       200:
 *         description: Number of likes for the blog post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likes:
 *                   type: integer
 *                   example: 10
 *       404:
 *         description: Blog post not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/blogs/:id/likes', getLikesCount);

module.exports = router;
