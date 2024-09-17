const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const jwtSecret = process.env.JWT_SECRET || 'secret_key0987'; // Use environment variable for secret key

// Validation schema
const schema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('admin', 'user').optional()  // Validate role if provided
});

// Create User
exports.createUser = async (req, res) => {
    try {
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send({ error: error.details[0].message });

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Set role to 'user' by default if not provided
        const role = req.body.role || 'user';

        const user = new User({
            password: hashedPassword,
            email: req.body.email,
            role: role,
        });

        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send({ error: 'Error creating user' });
    }
};

// Login User
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

        // Create payload and generate token
        const payload = { id: user._id, role: user.role };
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

        // Send token and role in the response
        res.send({ token: `Bearer ${token}`, role: user.role });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send({ error: 'Error logging in' });
    }
};
