const { v4: uuidv4 } = require('uuid');

const jwt = require('jsonwebtoken');
const fs = require('fs');

const configPath = 'config.json';
const parsedConfig = JSON.parse(fs.readFileSync(__dirname + '/../' + configPath, 'utf-8'));
const generateAccessToken = (userID) => {
    const payload = {
        userID,
        type : 'access',
    };
   
    const options = {expiresIn: 60 * 60};
    return jwt.sign(payload, parsedConfig.jwt, options);
}

const generateRefreshToken = () => {
    const payload = {
        id: uuidv4(),
        type : 'refresh',
    };
    const options = {expiresIn: 60 * 60  * 60};
    return {
        id: payload.id,
        token: jwt.sign(payload, parsedConfig.jwt, options),
    };
}

const generatePasswordToken = () => {
    const payload = {
        id: uuidv4(),
        type : 'password',
    };
    const options = {expiresIn: 60 * 5};
    return {
        id: payload.id,
        token: jwt.sign(payload, parsedConfig.jwt, options),
    };
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generatePasswordToken
}