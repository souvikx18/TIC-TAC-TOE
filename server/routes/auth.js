const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { signupValidation, loginValidation, validate } = require('../middleware/validate');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for profile picture uploads
// Configure multer for profile picture uploads - Store in memory for DB storage
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images (jpg, png, gif) are allowed'));
    }
});

// @route   POST /api/auth/signup
// @desc    Register new user
// @access  Public
router.post('/signup', signupValidation, validate, async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                [require('sequelize').Op.or]: [{ email }, { username }]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email
                    ? 'Email already registered'
                    : 'Username already taken'
            });
        }

        // Create new user (password will be hashed by model hook)
        const user = await User.create({
            username,
            email,
            password
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set secure HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, validate, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });

        // Check if user is locked out
        if (user && user.lockoutUntil && new Date(user.lockoutUntil) > new Date()) {
            return res.status(401).json({
                success: false,
                message: 'Account is locked due to too many failed login attempts. Try again in 30 minutes.'
            });
        }

        // Reset lockout if it's expired
        if (user && user.lockoutUntil && new Date(user.lockoutUntil) <= new Date()) {
            user.failedLoginAttempts = 0;
            user.lockoutUntil = null;
            await user.save();
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            // Increment failed attempts
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

            // Lock account after 5 failed attempts
            if (user.failedLoginAttempts >= 5) {
                user.lockoutUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
                await user.save();
                return res.status(401).json({
                    success: false,
                    message: 'Account locked due to too many failed login attempts. Try again in 30 minutes.'
                });
            }

            await user.save();
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Reset failed attempts on successful login
        user.failedLoginAttempts = 0;
        user.lockoutUntil = null;
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Set secure HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });

        // Always return success to prevent email enumeration
        if (!user) {
            return res.json({
                success: true,
                message: 'If that email exists, a password reset link has been sent'
            });
        }

        // Generate reset token
        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token before saving to database
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set token and expiration (1 hour)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        // Send email
        const { sendPasswordResetEmail } = require('../config/email');
        await sendPasswordResetEmail(user.email, resetToken);

        res.json({
            success: true,
            message: 'If that email exists, a password reset link has been sent'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing password reset request'
        });
    }
});

// @route   GET /api/auth/verify-reset-token/:token
// @desc    Verify reset token is valid
// @access  Public
router.get('/verify-reset-token/:token', async (req, res) => {
    try {
        const { token } = req.params;

        // Hash the token to compare with database
        const crypto = require('crypto');
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: {
                    [require('sequelize').Op.gt]: new Date()
                }
            }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        res.json({
            success: true,
            email: user.email
        });
    } catch (error) {
        console.error('Verify token error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying reset token'
        });
    }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Validate password strength
        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        // Check password complexity
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
            });
        }

        // Hash the token to compare with database
        const crypto = require('crypto');
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: {
                    [require('sequelize').Op.gt]: new Date()
                }
            }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Update password (will be hashed by model hook)
        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({
            success: true,
            message: 'Password has been reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password'
        });
    }
});

const auth = require('../middleware/auth');
const { socialMediaValidation } = require('../middleware/validate');

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email', 'instagramUrl', 'facebookUrl', 'snapchatUrl', 'profilePicture']
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.profilePicture) {
            // Convert BLOB to Base64 string for frontend display
            const base64Image = user.profilePicture.toString('base64');
            // Check original file type or default to png
            user.setDataValue('profilePicture', `data:image/png;base64,${base64Image}`);
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile'
        });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, socialMediaValidation, validate, async (req, res) => {
    try {
        const { username, instagramUrl, facebookUrl, snapchatUrl, profilePicture } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields if provided
        if (username) user.username = username;
        user.instagramUrl = instagramUrl;
        user.facebookUrl = facebookUrl;
        user.snapchatUrl = snapchatUrl;
        if (profilePicture !== undefined) user.profilePicture = profilePicture;

        await user.save();

        let profilePictureResponse = user.profilePicture;
        if (user.profilePicture) {
            const base64Image = user.profilePicture.toString('base64');
            profilePictureResponse = `data:image/png;base64,${base64Image}`;
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                instagramUrl: user.instagramUrl,
                facebookUrl: user.facebookUrl,
                snapchatUrl: user.snapchatUrl,
                profilePicture: profilePictureResponse
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating profile'
        });
    }
});

// @route   POST /api/auth/profile-picture
// @desc    Upload profile picture
// @access  Private
router.post('/profile-picture', auth, upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update user's profile picture with the buffer
        user.profilePicture = req.file.buffer;
        await user.save();

        // Convert to base64 for immediate frontend update
        const base64Image = req.file.buffer.toString('base64');
        const profilePictureData = `data:${req.file.mimetype};base64,${base64Image}`;

        res.json({
            success: true,
            message: 'Profile picture uploaded successfully',
            profilePicture: profilePictureData
        });
    } catch (error) {
        console.error('Profile picture upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error uploading profile picture'
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user and clear auth cookie
// @access  Private
router.post('/logout', auth, (req, res) => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;
