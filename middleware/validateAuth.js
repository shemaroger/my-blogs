const jwt = require('jsonwebtoken');

// Middleware to validate JWT tokens
module.exports = (req, res, next) => {
    // Extract the token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1];

    // If no token is provided, respond with an error
    if (!token) {
        console.error('No token provided');
        return res.status(401).send({ error: 'No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, 'secret_key0987');
        
        // Attach user information to the request object
        req.user = {
            _id: decoded.id,
            email: decoded.email
        };
        
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Log specific error message for debugging
        console.error('Token verification error:', error.message);

        // If the token is invalid or expired, respond with an error
        res.status(401).send({ error: 'Invalid token' });
    }
};
