const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Protect routes: Verifies the token for logged-in users (both users and admins)
exports.protect = async (req, res, next) => {
  let token;

  // Check if Authorization header is present and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded);
      // Attach the user data to req.user (excluding the password)
      req.user = await User.findById(decoded.id).select('-password');

      // Ensure user exists in the database
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Proceed to the route
      next();
    } catch (error) {
      // Handle invalid token or verification errors
      console.error('Token Verification Error:', error.message); // Debugging log
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // Handle missing token
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin protect: Ensures only admins can access the admin routes
exports.adminProtect = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    // Proceed to the route if the user is an admin
    next();
  } else {
    // Deny access if the user is not an admin
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
};
