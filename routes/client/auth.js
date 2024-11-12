const authRoute = require("express").Router();
const { asyncError } = require("../../libs/errors/asyncError");
const { apiBadRequestError } = require("../../libs/errors/appError");
const bcrypt = require('bcrypt')
const { comaparePassword, generateToken, emailRegex } = require("../../libs/helpers");
const { verifyToken } = require("../../middlewares/verifyToken");
const { prisma } = require("../../prismaClient");
const myEmitter = require("../../services/eventEmitter");


// Register User
authRoute.post('/register', asyncError(async (req, res) => {
    const { firstname, lastname, email, password } = req.body
    if (!firstname || !lastname || !email || !password) throw new apiBadRequestError("fill the empty spaces");

    const emailExist = await prisma.user.findFirst({ where: { email: email } });

    if (!emailRegex.test(email)) {
        throw new apiBadRequestError("invalid email")
    }

    if (emailExist) throw new apiBadRequestError("email already exists");

    const hPassword = await bcrypt.hash(password, 10);

    const payload = { firstname, lastname, email, password: hPassword };

    if (await prisma.user.create({ data: { ...payload } })) {
        myEmitter.emit('userRegistered', email, firstname)
        res.sendStatus(200);
        return;
    }
    throw new apiBadRequestError("registration failed");
}))

// Login User
authRoute.post('/login', asyncError(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new apiBadRequestError("fill the empty spaces");

    const user = await prisma.user.findFirst({ where: { email: email } });

    if (!user || !await comaparePassword(password, user.password)) {
        throw new apiBadRequestError("user and password does not match");
    }

    const token = await generateToken({ user_id: user?.id, email: user?.email });

    const maxAge = 604800000;

    res.cookie('auth', `Bearer ${token}`, {
        httpOnly: true,
        sameSite: false,
        maxAge,
    })

    return res.status(200).send({ token })
}));

// Logout
authRoute.post('/logout', asyncError(async (req, res) => {
    res.clearCookie('auth', { maxAge: 0 })
    res.sendStatus(200)
}))


// Islogin
authRoute.get('/verify', verifyToken(['user'], 'client'), asyncError(async (req, res) => {
    res.status(200).send({ isLogin: true })
}))

// get user
authRoute.get('/user', verifyToken(['user'], 'client'), asyncError(async (req, res) => {
    const userID = req.user?.user_id

    const user = await prisma.user.findFirst({ where: { id: userID }, include: { orders: true, address: true } })

    if (user) {
        res.status(200).send(user)
        return
    }

    throw new apiBadRequestError("something happened")

}))

module.exports = { authRoute }