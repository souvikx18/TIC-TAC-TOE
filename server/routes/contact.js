const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { contactValidation, validate } = require('../middleware/validate');

// @route   POST /api/contact
// @desc    Submit contact message
// @access  Public
router.post('/', contactValidation, validate, async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Create new message
        const newMessage = await Message.create({
            name,
            email,
            message
        });

        res.status(201).json({
            success: true,
            message: 'Message sent successfully! We will get back to you soon.',
            data: {
                id: newMessage.id,
                name: newMessage.name,
                email: newMessage.email
            }
        });
    } catch (error) {
        console.error('Contact message error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});

module.exports = router;
