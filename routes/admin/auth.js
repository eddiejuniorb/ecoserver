const authAdmin = require('express').Router();
const { asyncError } = require('../../libs/errors/asyncError');
const { apiBadRequestError, apiNotFoundError } = require('../../libs/errors/appError');
const { prisma } = require('../../prismaClient');
const { comaparePassword, generateToken, hashedPassword, setAuthCookie } = require('../../libs/helpers');
const { verifyJwtTokenAdmins } = require('../../middlewares/verifyToken');
const { AuthController } = require('../../controllers/Auth');


const roles = ["admin", "cashier", "operator"];

authAdmin.post('/add', asyncError(async (req, res) => {

    const { firstname, lastname, email, display_picture, role, password } = req.body;

    const dp = display_picture ? display_picture : ""

    if (!firstname || !lastname || !email || !role || !password) {
        throw new apiBadRequestError("fill the empty spaces")
    }

    if (await prisma.staffs.findFirst({ where: { email } })) {
        throw new apiBadRequestError("email already exists")
    }

    if (!roles.includes(role)) {
        throw new apiBadRequestError("invalid role")
    }

    const hashedPass = await hashedPassword(password)

    const payload = {
        role,
        lastname,
        firstname,
        email,
        display_picture: dp,
        password: hashedPass
    }

    if (await prisma.staffs.create({ data: { ...payload } })) {
        res.status(200).send({ message: "Successfully" })
        return;
    }

    throw new apiBadRequestError("Something happened");

}))

// Login
authAdmin.post('/login', AuthController.adminAuthLogin())

// Logout

authAdmin.get('/logout', AuthController.logout())

authAdmin.get('/user', verifyJwtTokenAdmins.allAudience(), asyncError(async (req, res) => {
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
    verifyJwtTokenAdmins.allAudience(),
    asyncError(async (req, res) => {
        res.status(200).send({ data: true })
    })
)


module.exports = { authAdmin }

