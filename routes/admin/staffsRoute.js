const staffsRoute = require('express').Router()
const { asyncError } = require('../../libs/errors/asyncError');
const { verifyJwtTokenAdmins } = require('../../middlewares/verifyToken');
const { prisma } = require('../../prismaClient');
const { apiBadRequestError, apiNotFoundError } = require('../../libs/errors/appError');
const { hashedPassword } = require('../../libs/helpers');


// Get All staffs
staffsRoute.get('/', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const { page, limit, name } = req.query;

    const skip = (page - 1) * limit;
    const take = parseInt(limit)

    const staffs = await prisma.staffs.findMany({
        take, skip, orderBy: { iat: 'desc' },
        where: {
            ...(name && {
                OR: [
                    { firstname: { contains: name } },
                    { lastname: { contains: name } },
                ],
            }),
        }
    });

    const total = await prisma.staffs.count();
    const totalPages = Math.ceil(total / take);

    return res.status(200).send({ staffs, totalPages })
}))


// Add Staff or Update
staffsRoute.post('/', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const { firstname, lastname, email, password, display_picture, role, id } = req.body
    if (!firstname || !lastname || !email || !password || !display_picture || !role) throw new apiBadRequestError("fill the empty spaces");

    if (!id && await prisma.staffs.findFirst({ where: { email: email } })) throw new apiBadRequestError("email already exists")

    const hashedPassword1 = await hashedPassword(password)

    const addorUpdated = await prisma.staffs.upsert({
        where: { id: id || "" },
        update: {
            firstname,
            lastname,
            email,
            password: hashedPassword1,
            display_picture,
            role
        },
        create: {
            firstname,
            lastname,
            email,
            password: hashedPassword1,
            display_picture,
            role
        }
    })

    if (addorUpdated) {
        res.sendStatus(200)
        return
    }

    throw new apiBadRequestError("something happened")

}))


staffsRoute.delete('/', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const { id } = req.query;

    if (!id) throw new apiBadRequestError("provide id");

    if (!await prisma.staffs.findFirst({ where: { id: id } })) {
        throw new apiNotFoundError();
    }

    if (await prisma.staffs.delete({ where: { id: id } })) return res.sendStatus(200);

    throw new apiBadRequestError("somthing happened")
}))


module.exports = { staffsRoute }