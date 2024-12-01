const jwt = require('jsonwebtoken');

// Middleware to check if the user is authenticated
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store decoded user info in request object
    console.log(req.user)
    next(); 
    
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};


module.exports = {verifyToken};
