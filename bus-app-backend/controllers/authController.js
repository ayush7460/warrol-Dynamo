import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { validateEmail, validatePhone } from '../utils/validators.js';

export const authController = {
  // Login controller for all user types
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check if bus owner is approved
      if (user.role === 'busowner' && !user.approved) {
        return res.status(403).json({
          success: false,
          error: 'Your account is pending approval'
        });
      }

      // Generate token
      const token = jwt.sign(
        { 
          id: user._id,
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            approved: user.approved,
            companyName: user.companyName
          },
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed'
      });
    }
  },

  // Register controller with role-specific validation
  register: async (req, res) => {
         console.log('Request body:', req.body); // 🔍 Log body content

    try {
      const {
        name,
        email,
        password,
        phone,
        role,
        companyName,
        licenseNumber,
        aadhaarNumber
      } = req.body || {};



      // Basic validation
      if (!name || !email || !password || !phone || !role) {
        return res.status(400).json({
          success: false,
          error: 'All required fields must be provided'
        });
      }

      // Validate email and phone
      // if (!validateEmail(email)) {
      //   return res.status(400).json({
      //     success: false,
      //     error: 'Invalid email format'
      //   });
      // }

      // if (!validatePhone(phone)) {
      //   return res.status(400).json({
      //     success: false,
      //     error: 'Invalid phone number format'
      //   });
      // }

      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already registered'
        });
      }

      // Additional validation for bus owners
      if (role === 'busowner') {
        if (!companyName || !licenseNumber || !aadhaarNumber) {
          return res.status(400).json({
            success: false,
            error: 'Bus owner registration requires additional details'
          });
        }
      }

      // Create user
      const userData = {
        name,
        email,
        password,
        phone,
        role,
        approved: role !== 'busowner', // Auto approve customers
        ...(role === 'busowner' && {
          companyName,
          licenseNumber,
          aadhaarNumber
        })
      };

      const user = new User(userData);
      await user.save();

      const token = jwt.sign(
        { 
          id: user._id,
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            approved: user.approved,
            companyName: user.companyName
          },
          token
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed'
      });
    }
  },

  verifyToken: async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: 'Token is required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Optionally fetch user info
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
}

};