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

const jwt = require('jsonwebtoken'); // Assuming you're using JWT

// Middleware to validate token
const validateAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // Ensure that the token exists in the Authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add the decoded user to the request object
        console.log('Decoded user:', decoded); // Logging for debugging
        next();
    } catch (err) {
        console.error('Token validation error:', err.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = validateAuth;
