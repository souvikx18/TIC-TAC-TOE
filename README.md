🎮 Tic-Tac-Toe Game Platform

> A modern, full-featured Tic-Tac-Toe web application with secure authentication, user profiles, and real-time gameplay.

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/Node.js-v14+-green?logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue?logo=mysql)

</div>

---

🌟 Overview

Hey there, friend! 👋 Welcome to **Tic-Tac-Toe**, a beautifully designed, production-ready web application that brings the classic game you love to the modern web. Whether you're looking to kill some time with a quick game, challenge your friends, learn how a full-stack app works, or just have some fun - you've come to the right place! This application is built with care and delivers a complete experience with secure user authentication, personalized profiles, and persistent game storage. It's like having your own personal game server!

---

✨ Key Features

- **🔐 Secure User Authentication** - Industry-standard security with JWT tokens and Bcrypt password hashing
- **👤 Profile Management** - Create and customize your profile with avatar storage directly in the database
- **🎯 Classic Gameplay** - Smooth, responsive Tic-Tac-Toe board with intelligent game state management
- **📧 Email Integration** - Account recovery with secure password reset links via Nodemailer
- **🛡️ Production-Ready Security** - Helmet headers, CORS protection, and rate limiting to prevent abuse
- **📱 Fully Responsive Design** - Beautiful modern UI that adapts seamlessly to all screen sizes and devices
- **🌓 Theme Support** - Dark/light mode toggle for comfortable gaming experience
- **💻 Modern Architecture** - Clean separation of concerns with RESTful API design

---

🛠️ Technology Stack

  Frontend
- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with custom properties and flexbox/grid layouts
- **JavaScript (ES6+)** - Pure vanilla JS with no framework dependencies

  Backend
- **Node.js** - Runtime environment for server-side JavaScript
- **Express.js** - Lightweight and flexible web framework
- **Sequelize ORM** - Database abstraction layer for MySQL

  Database & Storage
- **MySQL** - Reliable relational database for user data and game records
- **BLOB Storage** - Profile photos stored directly in the database

  Security & Quality
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Bcrypt** - Industry-standard password hashing
- **Helmet** - Secures HTTP headers
- **CORS** - Cross-origin resource sharing management
- **Express Rate Limit** - Brute-force protection

---

📁 Project Architecture

```
Tic-Tac-Toe/
├── 📄 HTML Pages
│   ├── index.html              # 🏠 Landing page with game overview
│   ├── login.html              # 🔑 User login form
│   ├── signup.html             # ✍️ New user registration
│   ├── game.html               # 🎮 Main game board
│   ├── profile.html            # 👤 User profile management
│   ├── about.html              # ℹ️ About page
│   ├── contact.html            # 📞 Contact form
│   ├── forgot-password.html    # 🔍 Password recovery
│   └── reset-password.html     # 🔄 Password reset form
│
├── 🖼️ Frontend Assets
│   ├── assets/                 # Images, icons, and static files
│   ├── styles/                 # Global and page-specific CSS
│   │   ├── global.css          # Global styles and resets
│   │   ├── layout.css          # Page layout components
│   │   ├── main.css            # Main application styles
│   │   ├── game.css            # Game board and UI styles
│   │   ├── auth.css            # Authentication pages styling
│   │   ├── profile.css         # Profile page styling
│   │   ├── about.css           # About page styling
│   │   ├── contact.css         # Contact form styling
│   │   └── notifications.css   # Alert and notification styles
│   └── scripts/                # Frontend JavaScript logic
│       ├── api.js              # API client for backend communication
│       ├── game.js             # Core game logic and state management
│       ├── main.js             # General UI interactions
│       └── theme.js            # Dark/light mode switching
│
├── 🔧 Backend Server
│   ├── server.js               # Main application entry point
│   ├── 📋 config/              # Configuration modules
│   │   ├── database.js         # MySQL connection and Sequelize setup
│   │   └── email.js            # Nodemailer configuration
│   ├── 🔒 middleware/          # Express middleware functions
│   │   ├── auth.js             # JWT authentication verification
│   │   └── validate.js         # Input validation and sanitization
│   ├── 📊 models/              # Sequelize ORM models
│   │   ├── User.js             # User model (auth, profile, avatar)
│   │   └── Message.js          # Contact message model
│   └── 🛣️ routes/             # API endpoint definitions
│       ├── auth.js             # Authentication & profile endpoints
│       └── contact.js          # Contact form endpoints
│
└── 📦 Configuration
    └── package.json            # Dependencies and npm scripts
```

---

🚀 Let's Get Started!

Ready to bring this awesome game to life on your machine? Here's what you'll need:

# What You Need
- **Node.js** v14 or higher (grab it from [nodejs.org](https://nodejs.org))
- **npm** or **yarn** (comes with Node.js - bonus!)
- **MySQL** 8.0 or higher (set up locally or use a cloud database)
- Any modern web browser you love (Chrome, Firefox, Safari, or Edge)

# Installation Steps

Don't worry - we'll walk you through this! It's easier than you think.

# 1️⃣ Clone or Download the Project

Grab the project code:

```bash
git clone <repository-url>
cd Tic-Tac-Toe
```

# 2️⃣ Install All the Magic (Dependencies)

Let npm work its magic and install everything needed:

```bash
npm install
```

Grab a coffee ☕ - this takes a minute!

# 3️⃣ Set Up Your Environment Variables

Create a `.env` file in the root directory and add YOUR settings:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=tictactoe_db
DB_USER=root
DB_PASS=your_password

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# Email Configuration (Gmail recommended)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Server Settings
PORT=3000
NODE_ENV=development
```

**💡 Pro Tip:** If you're using Gmail, don't use your regular password! Generate a special [App Password](https://myaccount.google.com/apppasswords) instead - it's more secure!

# 4️⃣ Create Your Database

Let's give your app a home for all its data:

```bash
mysql -u root -p
```

Then type:

```bash
CREATE DATABASE tictactoe_db;
EXIT;
```

All set! 🎉

# 5️⃣ Fire It Up!

Here's the exciting part:

**During Development** (code changes reload instantly):
```bash
npm run dev
```

**Ready for the World** (production mode):
```bash
npm start
```

Then visit **http://localhost:3000** in your browser - your game is ready! 🎮✨

---

📚 API Documentation

Here's what you can do with our API! Whether you're building a mobile app, integrating with other services, or just curious - these endpoints are your gateway to the power of Tic-Tac-Toe.

 Authentication Endpoints

Talk to these endpoints to handle all user account stuff:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user account |
| POST | `/api/auth/login` | Login with email and password |
| POST | `/api/auth/forgot-password` | Request password reset email |
| POST | `/api/auth/reset-password` | Reset password with token |
| GET | `/api/auth/profile` | Get current user profile |
| PUT | `/api/auth/profile` | Update user profile |

 Contact Endpoints

Got feedback? Need to reach out? Use this endpoint to send messages:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit a message or feedback from the contact form |

---

🎮 How to Play

It's simple and fun!

1. **Create Your Profile** - Sign up with your email and password. Welcome aboard!
2. **Log In** - Come back anytime. Your account is safe with us.
3. **Start a Game** - Click "Play Game" and challenge yourself
4. **Make Your Moves** - Click any empty square to place your X
5. **Win!** - Get three in a row (horizontal, vertical, or diagonal). Victory is yours! 🏆
6. **Track Your Stats** - See your wins, upload an avatar, and build your profile

---

🔐 Security Features

Your data is precious to us! We've implemented multiple layers of security to keep everything safe and sound:

 Authentication & Authorization
- ✅ JWT-based stateless authentication
- ✅ Bcrypt password hashing with salt rounds
- ✅ Secure session management
- ✅ Protection against common attacks

 Backend Protection
- ✅ **Helmet.js** - Sets secure HTTP headers
- ✅ **CORS** - Controls cross-origin requests
- ✅ **Rate Limiting** - Prevents brute-force attacks
- ✅ **Input Validation** - Express-validator for data sanitization
- ✅ **HTTPS Ready** - Production-ready SSL/TLS support

 Database Security
- ✅ SQL injection prevention via Sequelize ORM
- ✅ Encrypted password storage
- ✅ Secure BLOB storage for profile images
- ✅ Data validation at model level

---
📋 Available Scripts

Here are the handy commands you'll use to manage your app:

| Command | Description |
|---------|-------------|
| `npm start` | Start the production server |
| `npm run dev` | Start with Nodemon (auto-reload on file changes) |
| `npm test` | Run test suite (if configured) |

---
🛠️ Development Tips

Wanna understand how this app works or extend it? Here's what you should know:

 How We Built It

**Keep Things Organized** - Frontend, backend, and database are nicely separated so you can find stuff easily.

**RESTful API** - We use standard HTTP methods (GET, POST, etc.) because it's the way to go.

**Following MVC** - Models, routes, and controllers are organized so the code is clean and readable.

**Secrets Stay Secret** - All sensitive info lives in `.env` - never hardcoded in the app.

 How to Debug When Things Break

**Frontend Debugging** - Use browser DevTools (F12 or right-click → Inspect) and check the Console tab for errors.

**Backend Debugging** - Look at the terminal where you ran `npm run dev` - the server tells you what's happening.

**Database Issues** - Login to MySQL directly and check your data. Sometimes a quick `SELECT * FROM users;` tells you everything.

**Still Stuck?** - Check the Security Features section and verify all your configurations. 9 times out of 10, it's a `.env` typo!

---
🐛 Troubleshooting

Hit a bump? No worries - we've all been there! Here's how to fix common issues:

 Common Headaches & How to Fix Them

**Port 3000 Already in Use**

Something else is using your port? No problem, just kill it:
```bash
npx kill-port 3000
```

**Can't Connect to the Database**

- Is MySQL actually running? Try: `mysql -u root -p`
- Check your `.env` file - does it match your actual MySQL username and password? (typos are sneaky!)
- Does the database exist? Run `SHOW DATABASES;` in MySQL to check

**Emails Not Arriving**

- Using Gmail? Make sure you generated an [App Password](https://myaccount.google.com/apppasswords) - not your regular password!
- Check your spam folder - sometimes welcome emails get lonely there
- Double-check that the email in `.env` is spelled correctly

**CORS or Connection Errors**

- These usually mean the frontend and backend aren't talking properly
- Make sure the backend is running (check your terminal - you should see a message)
- Verify you're accessing the right URL (`http://localhost:3000`)

**Token/Login Issues**

- Browser got confused? Clear your cookies and try again
- Log out completely and log back in to get a fresh token
- Still stuck? Try in an incognito/private browser window

---
 📁 File Configuration Details

 Frontend Entry Points
- **index.html** - Entry point for the application
- **script.js** - Main frontend initialization
- **style.css** - Global styles

 Backend Configuration
- **server.js** - Starts Express server
- **server/config/database.js** - Sequelize connection
- **server/config/email.js** - Nodemailer setup

---
 🌟 Future Enhancements

We're always thinking of ways to make this even more awesome! Here are some exciting features we're dreaming about for future versions:

- 🤖 **AI Opponent** - Challenge a clever computer player in single-player mode
- 🌐 **Real-time Multiplayer** - Play against friends online with instant updates
- 📊 **Leaderboards** - See where you stand compared to other players
- 🎨 **Custom Themes** - Personalize the look and feel your way
- 📱 **Progressive Web App** - Play like a native app, even offline
- 🔔 **Live Notifications** - Get alerts when you get challenged or win big

Got an idea? We'd love to hear it! Drop us a line in the Support section above.

---
 📞 Support & Contact

Wanna chat? Have a question? Found a bug?

- **📫 Email** - souvikwork199@gmail.com
- **💬 Got a Problem?** - Send me a mail with the bug and issues.
- **💡 Got an Idea?** - We'd love to hear your feedback and suggestions!

We're here to help and love hearing from players and developers like you!

---
 📄 License

This project is licensed under the **MIT License** - meaning you're free to use it, modify it, and share it with the world! Do whatever you want with it for personal or commercial use. We just ask that you keep the original license notice. Happy coding! 🚀

---

<div align="center">

 🎉 Let's Build Something Amazing Together!

Made with ❤️ passion, ☕ coffee, and 💡 creativity by **SOUVIK**

**Have fun, learn something new, and enjoy the game!** 🎮

---

*If this project helped you or brought you joy, please give it a star! ⭐*

</div>
