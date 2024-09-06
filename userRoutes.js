const express = require('express');
const router = express.Router();
const { createUser, loginUser } = require('./controller/userController');

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new account
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
 *       201:
 *         description: Account created successfully.
 *       400:
 *         description: The provided data is not valid.
 */
router.post('/users', createUser);

/**
 * @swagger
 * /userLogin:
 *   post:
 *     summary: Authenticate a user
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
 *         description: User successfully logged in.
 *       401:
 *         description: Authentication failed, incorrect credentials.
 *       400:
 *         description: The provided data is not valid.
 */
router.post('/userLogin', loginUser);

module.exports = router;
