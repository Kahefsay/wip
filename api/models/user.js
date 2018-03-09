/* eslint new-cap: [0] */
let crypto = require('crypto');
let jwt = require('jsonwebtoken');

module.exports = function(sequelize, Sequelize) {
    let userSchema = sequelize.define('User', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        firstname: {
            type: Sequelize.STRING,
            notEmpty: true,
        },
        lastname: {
            type: Sequelize.STRING,
            notEmpty: true,
        },
        username: {
            type: Sequelize.TEXT,
            notEmpty: true,
        },
        hash: {
            type: Sequelize.STRING,
        },
        salt: {
            type: Sequelize.STRING,
        },
        last_login: {
            type: Sequelize.DATE,
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active',
        },
    });

    userSchema.setPassword = function(password) {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
        .toString('hex');
    };

    userSchema.validPassword = function(password) {
        let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
        .toString('hex');
        return this.hash === hash;
    };

    userSchema.generateJwt = function() {
        let expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        return jwt.sign({
            _id: this.id,
            username: this.username,
            name: this.lastname,
            exp: parseInt(expiry.getTime() / 1000),
        }, 'secret');
    };

    return userSchema;
};
