const nodemailer = require('nodemailer');
require('dotenv').config();

// Create email transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
    const transporter = createTransporter();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password.html?token=${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM || 'Tic-Tac-Toe <noreply@tictactoe.com>',
        to: email,
        subject: 'Password Reset Request - Tic-Tac-Toe',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f0f4f8;
                        margin: 0;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background: white;
                        border-radius: 12px;
                        padding: 40px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .logo {
                        font-size: 32px;
                        font-weight: 700;
                        color: #7FC6A4;
                        margin-bottom: 10px;
                    }
                    .content {
                        color: #333;
                        line-height: 1.6;
                    }
                    .button {
                        display: inline-block;
                        padding: 14px 32px;
                        background: linear-gradient(135deg, #7FC6A4, #422acc);
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                        margin: 20px 0;
                    }
                    .button:hover {
                        opacity: 0.9;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #eee;
                        color: #666;
                        font-size: 14px;
                        text-align: center;
                    }
                    .warning {
                        background: #fff3cd;
                        border-left: 4px solid #ffc107;
                        padding: 12px;
                        margin: 20px 0;
                        border-radius: 4px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">🎮 Tic-Tac-Toe</div>
                        <h2 style="color: #333; margin: 0;">Password Reset Request</h2>
                    </div>
                    
                    <div class="content">
                        <p>Hello,</p>
                        <p>We received a request to reset your password for your Tic-Tac-Toe account.</p>
                        <p>Click the button below to reset your password:</p>
                        
                        <div style="text-align: center;">
                            <a href="${resetUrl}" class="button">Reset Password</a>
                        </div>
                        
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="background: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">
                            ${resetUrl}
                        </p>
                        
                        <div class="warning">
                            <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
                        </div>
                        
                        <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                    </div>
                    
                    <div class="footer">
                        <p>This is an automated email from Tic-Tac-Toe. Please do not reply.</p>
                        <p style="color: #999; font-size: 12px;">© 2026 Tic-Tac-Toe Platform. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Password reset email sent to:', email);
        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw new Error('Failed to send password reset email');
    }
};

module.exports = {
    sendPasswordResetEmail
};
