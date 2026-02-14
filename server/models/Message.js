const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [2, 100],
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [10, 5000],
            notEmpty: true
        }
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'messages',
    timestamps: true
});

module.exports = Message;
