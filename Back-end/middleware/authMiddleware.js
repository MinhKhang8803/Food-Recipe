const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    console.log('Token received:', token); 

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded;
        console.log('Authenticated user:', decoded);
        next();
    } catch (error) {
        console.error('Token error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};


module.exports = authMiddleware;
