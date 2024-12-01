
const authorize = (role) => {
    return (req, res, next) => {
      const userRole = req.user.role; 
      if (userRole !== role) {
        return res.status(403).json({ message: 'Forbidden: Access is denied' });
      }
      next();
    };
  };
  
  module.exports = { authorize };
  