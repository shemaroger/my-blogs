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
 *     responses:
 *       201:
 *         description: User account successfully created.
 *       400:
 *         description: Invalid input data.
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
 *       401:
 *         description: Failed login, incorrect credentials.
 *       400:
 *         description: Invalid input data.
 */
router.post('/userLogin', loginUser);

module.exports = router;
