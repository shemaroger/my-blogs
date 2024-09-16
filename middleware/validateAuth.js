const jwt = require('jsonwebtoken');

// Middleware to validate JWT tokens
module.exports = (req, res, next) => {
    // Extract the token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1];
    
    // If no token is provided, respond with an error
    if (!token) {
        return res.status(401).send({ error: 'No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, 'secret_key0987');
        
        // Attach user information to the request object
        req.user = {
            _id: decoded.id,       // Use `_id` to match controller expectations
            username: decoded.username  // Adjust according to the payload structure
        };
        
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // If the token is invalid or expired, respond with an error
        res.status(401).send({ error: 'Invalid token' });
    }
};
