const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'tictactoe_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false, // Set to console.log to see SQL queries
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Test database connection
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL Database connected successfully');

        // Sync all models (creates tables if they don't exist)
        const shouldAlter = process.env.NODE_ENV === 'development';
        await sequelize.sync({ alter: shouldAlter });
        console.log('✅ Database models synchronized');
    } catch (error) {
        console.error('❌ Unable to connect to database:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
