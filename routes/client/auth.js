const authRoute = require("express").Router();
const { asyncError } = require("../../libs/errors/asyncError");
const { apiBadRequestError, apiNotFoundError, apiUnthorizedError } = require("../../libs/errors/appError");
const bcrypt = require('bcrypt')
const { emailRegex, phoneRegex, hashedPassword, verifyJwtToken } = require("../../libs/helpers");
const { verifyJwtTokenClients } = require("../../middlewares/verifyToken");
const { prisma } = require("../../prismaClient");
const myEmitter = require("../../services/eventEmitter");
const { AuthController } = require("../../controllers/Auth");
const sendPasswordReset = require("../../mail/sendPasswordReset");
const crypto = require('crypto')


// Register User
authRoute.post('/register', asyncError(async (req, res) => {
    const { firstname, lastname, email, password, phone, code } = req.body
    if (!firstname || !lastname || !email || !password || !phone || !code) throw new apiBadRequestError("fill the empty spaces");

    const emailExist = await prisma.user.findFirst({ where: { OR: [{ email: email }, { phone: phone }] } });

    const telephoneNumber = `${code}${phone}`

    if (!emailRegex.test(email)) {
        throw new apiBadRequestError("invalid email")
    }

    if (!phoneRegex.test(telephoneNumber)) {
        throw new apiBadRequestError("invalid phone number")
    }

    if (emailExist) throw new apiBadRequestError("email already exists");

    const hPassword = await bcrypt.hash(password, 10);

    const payload = { firstname, lastname, email, password: hPassword, phone: telephoneNumber };

    if (await prisma.user.create({ data: { ...payload } })) {
        myEmitter.emit('userRegistered', email, firstname)
        res.sendStatus(200);
        return;
    }
    throw new apiBadRequestError("registration failed");
}))

// Login User
authRoute.post('/login', AuthController.clientAuthLogin());

// Reset Password
authRoute.post('/reset', asyncError(async (req, res) => {
    const { email } = req.body
    if (!email) throw new apiBadRequestError("provide your email");

    if (!emailRegex.test(email)) throw new apiBadRequestError("invalid email")

    const user = await prisma.user.findFirst({ where: { email: email } });

    if (!user) throw new apiNotFoundError("You are not registered")

    const token = crypto.randomBytes(20).toString('hex');
    const resetToken = crypto.createHash('sha256').update(token).digest('hex')

    const client_url = process.env.client_url;

    const now = new Date();
    const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);


    await prisma.resetTokens.create({ data: { token: resetToken, user_id: user?.id, expires_at: tenMinutesLater } })
    await sendPasswordReset({ to: email, url: `${client_url}/account/reset/${user?.id}/${resetToken}` })

    res.sendStatus(200)

}))

// Verify new password


authRoute.post('/reset/:id/:token', asyncError(async (req, res) => {
    const { token, id } = req.params;
    const { password, cpassword } = req.body;

    const resetToken = await prisma.resetTokens.findFirst({ where: { user_id: id }, orderBy: { iat: 'desc' } });
    if (!resetToken) throw new apiBadRequestError("broken link");

    const now = new Date();
    const endDate = new Date(resetToken?.expires_at);

    if (now > endDate) {
        throw new apiBadRequestError("Reset Password link has expired!")
    } else if (resetToken?.token !== token) {
        throw new apiBadRequestError("Reset Password link is invalid!")
    }

    if (!password || !cpassword) throw new apiBadRequestError("Fill the empty spaces")
    if (password !== cpassword) throw new apiBadRequestError("Password's doesn't match");

    const hashPassword = await hashedPassword(password);

    await prisma.resetTokens.delete({ where: { user_id: id } })

    const updateUserPassword = await prisma.user.update({
        where: { id: id },
        data: { password: hashPassword }
    });

    if (!updateUserPassword) throw new apiBadRequestError("Some problem occurred!");

    return res.sendStatus(200)
}))

// Logout
authRoute.post('/logout', AuthController.logout())


// Islogin
authRoute.get('/verify', verifyJwtTokenClients.clientOnly(), asyncError(async (req, res) => {
    res.status(200).send({ isLogin: true })
}))

// get user
authRoute.get('/user', verifyJwtTokenClients.clientOnly(), asyncError(async (req, res) => {
    const userID = req.user?.user_id

    const user = await prisma.user.findFirst({
        where: { id: userID }, include: {
            orders: true,
            address: true
        }
    })

    if (user) {
        res.status(200).send(user)
        return
    }

    throw new apiBadRequestError("something happened")

}))

module.exports = { authRoute }