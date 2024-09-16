// const jwt = require('jsonwebtoken');

// // Middleware to validate JWT tokens
// module.exports = (req, res, next) => {
//     // Extract the token from the Authorization header
//     const token = req.headers['authorization']?.split(' ')[1];
    
//     // If no token is provided, respond with an error
//     if (!token) {
//         return res.status(401).send({ error: 'No token provided' });
//     }

//     try {
//         // Verify the token
//         const decoded = jwt.verify(token, 'secret_key0987');
        
//         // Attach user information to the request object
//         req.user = {
//             _id: decoded.id,       // Use `_id` to match controller expectations
//             username: decoded.username  // Adjust according to the payload structure
//         };
        
//         // Proceed to the next middleware or route handler
//         next();
//     } catch (error) {
//         // If the token is invalid or expired, respond with an error
//         res.status(401).send({ error: 'Invalid token' });
//     }
// };


const jwt = require('jsonwebtoken');

// Middleware to validate JWT tokens
module.exports = (req, res, next) => {
    // Extract the token from the Authorization header (e.g., "Bearer <token>")
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token not found' });
    }

    try {
        // Verify the token using the secret key (use environment variable for secret)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');

        // Attach the user data to the request object, for use in subsequent routes
        req.user = {
            _id: decoded.id,        // Assuming the payload contains `id`
            username: decoded.username  // Assuming the payload contains `username`
        };

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle specific JWT errors (expired, malformed, etc.)
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
