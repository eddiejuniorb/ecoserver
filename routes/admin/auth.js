const authAdmin = require('express').Router();
const { asyncError } = require('../../libs/errors/asyncError');
const { apiBadRequestError, apiNotFoundError } = require('../../libs/errors/appError');
const { prisma } = require('../../prismaClient');
const { comaparePassword, generateToken, hashedPassword } = require('../../libs/helpers');
const { verifyToken } = require('../../middlewares/verifyToken');


const roles = ["admin", "cashier", "operator"];

authAdmin.post('/add', asyncError(async (req, res) => {

    const { firstname, lastname, email, display_picture, role, password } = req.body;

    if (!firstname || !lastname || !email || !display_picture || !role || !password) {
        throw new apiBadRequestError("fill the empty spaces")
    }

    if (await prisma.staffs.findFirst({ where: { email } })) {
        throw new apiBadRequestError("email already exists")
    }

    if (!roles.includes(role)) {
        throw new apiBadRequestError("invalid role")
    }

    const payload = {
        role,
        lastname,
        firstname,
        email,
        display_picture,
    }

    const hashedPass = await hashedPassword(password)

    if (await prisma.staffs.create({ data: { ...payload, password: hashedPass } })) {
        res.status(200).send({ message: "Successfully" })
        return;
    }

    throw new apiBadRequestError("Something happened");

}))


authAdmin.post('/login', asyncError(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new apiBadRequestError("fill the empty spaces")
    }

    const user = await prisma.staffs.findFirst({ where: { email: email } });

    if (!user || !await comaparePassword(password, user.password)) {
        throw new apiBadRequestError("user and password does not match");
    }

    const token = await generateToken({ user_id: user?.id, email: user?.email });

    const maxAge = 604800000;

    res.cookie('auth', `Bearer ${token}`, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge,
    })

    return res.status(200).send({ token })
}))

authAdmin.get('/user', verifyToken(['admin', 'cashier', 'operator'], 'admin'), asyncError(async (req, res) => {
    const user = await prisma.staffs.findFirst({
        where: { email: req?.user?.email },
        select: {
            firstname: true, lastname: true, email: true, role: true, display_picture: true
        }
    });
    if (user) {
        res.status(200).send({ data: user })
        return;
    }
    throw new apiBadRequestError("something occured");
}))


authAdmin.get(
    '/verify',
    verifyToken(['admin', 'cashier', 'operator'], 'admin'),
    asyncError(async (req, res) => {
        res.status(200).send({ data: true })
    })
)


module.exports = { authAdmin }

