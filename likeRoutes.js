const express = require('express');
const router = express.Router();
const { toggleLike } = require('../controller/likeController');
const validateAuth = require('../middleware/validateAuth');

/**
 * @swagger
 * /blogs/{id}/like:
 *   post:
 *     similarities: Like or unlike a blog post
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
 *       404:
 *         description: Blog post not found.
 */
router.post('/blogs/:id/like', validateAuth, toggleLike);

module.exports = router;
