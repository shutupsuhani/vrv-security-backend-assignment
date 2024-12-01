const registerValidator = ({ name, email, password, role }) => {
    if (!name || !email || !password || !role) {
      return 'All fields are required';
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format';
    }
  
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
  
    const allowedRoles = ['Admin', 'Sub Admin', 'User', 'Editor'];
    if (!allowedRoles.includes(role)) {
      return 'Invalid role';
    }
  
    return null; // No errors
  };
  
  module.exports = registerValidator;
  