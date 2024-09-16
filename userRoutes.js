const express = require('express');
const router = express.Router();
const { createUser, loginUser } = require('./controller/userController');

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 default: user
 *     responses:
 *       201:
 *         description: User account successfully created.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Error creating user.
 */
router.post('/users', createUser);

/**
 * @swagger
 * /userLogin:
 *   post:
 *     summary: Log in to an existing user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Invalid input data or user not found.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: Error logging in.
 */
router.post('/userLogin', loginUser);

module.exports = router;
