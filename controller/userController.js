const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = 'secret_key0987'; 

// Middleware to validate user input using Joi
const Joi = require('joi');
const schema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('admin', 'user').optional()  // Validate role if provided
});

exports.createUser = async (req, res) => {
    try {
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send({ error: error.details[0].message });

        // Set role to 'user' by default if not provided
        const role = req.body.role || 'user';

        const user = new User({
            password: req.body.password,
            email: req.body.email,
            role: role,
        });

        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send({ error: "Error creating user" });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }

        // Include the role in the payload
        const payload = { id: user._id, role: user.role };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

        // Send both token and role in the response
        res.send({ token: `Bearer ${token}`, role: user.role });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send({ error: 'Error logging in' });
    }
};
