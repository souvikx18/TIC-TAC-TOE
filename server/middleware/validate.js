const { body, validationResult } = require('express-validator');

// Validation rules for signup
const signupValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)')
];

// Validation rules for login
const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Validation rules for contact message
const contactValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .escape(),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('message')
        .trim()
        .isLength({ min: 10, max: 5000 })
        .withMessage('Message must be between 10 and 5000 characters')
        .escape()
];

// Validation rules for social media URLs
const socialMediaValidation = [
    body('instagramUrl')
        .optional()
        .trim()
        .custom(value => {
            if (value && !isValidSocialMediaUrl(value, 'instagram')) {
                throw new Error('Invalid Instagram URL');
            }
            return true;
        }),
    
    body('facebookUrl')
        .optional()
        .trim()
        .custom(value => {
            if (value && !isValidSocialMediaUrl(value, 'facebook')) {
                throw new Error('Invalid Facebook URL');
            }
            return true;
        }),
    
    body('snapchatUrl')
        .optional()
        .trim()
        .custom(value => {
            if (value && !isValidSocialMediaUrl(value, 'snapchat')) {
                throw new Error('Invalid Snapchat handle');
            }
            return true;
        })
];

// Helper function to validate social media URLs
const isValidSocialMediaUrl = (url, platform) => {
    const patterns = {
        instagram: /^(@?[a-zA-Z0-9_.]+|https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?|https?:\/\/(www\.)?instagram\.com\/)$/,
        facebook: /^(https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9]+\/?)$/,
        snapchat: /^[a-zA-Z0-9._-]{3,30}$|^https?:\/\/(www\.)?snapchat\.com\//
    };
    return patterns[platform].test(url);
};

// Middleware to check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

module.exports = {
    signupValidation,
    loginValidation,
    contactValidation,
    socialMediaValidation,
    validate
};
