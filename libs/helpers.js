const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const hashedPassword = async (password) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

const comaparePassword = async (password, hashedPassword) => {
    const same = await bcrypt.compare(password, hashedPassword);
    return same;
}

const secret = process.env.jwt_secret;

const generateToken = async (payload) => {
    const token = jwt.sign(payload, secret);
    return token;
}

const verifyJwtToken = async (token) => {
    const payload = jwt.verify(token, secret);
    return payload;
}

const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/&/g, '-and-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
};

module.exports = { hashedPassword, slugify, verifyJwtToken, generateToken, comaparePassword }