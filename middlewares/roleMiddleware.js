// authorize middleware (roleMiddleware.js)
const authorize = (roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role; // Get user role from the request object
    
    if (!userRole || (Array.isArray(roles) && !roles.includes(userRole)) || roles !== userRole) {
      return res.status(403).json({ message: 'Access denied' }); // Forbidden if the role doesn't match
    }
    
    next(); // Proceed to the next middleware or route handler
  };
};

module.exports = { authorize };
