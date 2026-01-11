import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { configDotenv } from 'dotenv';

configDotenv();

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Role-based access control
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

// Check if user can access specific base data
export const checkBaseAccess = async (req, res, next) => {
  try {
    const { baseId } = req.params.baseId ? req.params : req.body;

    // Admin has access to all bases
    if (req.user.role === 'admin') {
      return next();
    }

    // Base commander can only access their assigned base
    if (req.user.role === 'base_commander') {
      if (!req.user.assignedBase) {
        return res
          .status(403)
          .json({ message: 'No base assigned to this user' });
      }

      if (req.user.assignedBase.toString() !== baseId) {
        return res.status(403).json({ message: 'Access denied to this base' });
      }
    }

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Server error in base access check' });
  }
};
