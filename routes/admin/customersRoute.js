const customersRoute = require('express').Router()
const { verifyJwtTokenAdmins } = require('../../middlewares/verifyToken');
const { asyncError } = require('../../libs/errors/asyncError');
const { apiBadRequestError, apiNotFoundError } = require('../../libs/errors/appError');
const { prisma } = require('../../prismaClient');


customersRoute.get('/:id/one', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const customerId = req.params?.id;

    if (!customerId) throw new apiBadRequestError();

    const customer = await prisma.user.findFirst({ where: { id: customerId }, include: { orders: true } });

    if (!customer) throw new apiNotFoundError("no customer found");

    return res.status(200).send(customer)
}))

customersRoute.get('/all', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const { page, limit, name } = req.query;

    const skip = (page - 1) * limit;
    const take = parseInt(limit)

    const customers = await prisma.user.findMany({
        take, skip, orderBy: { iat: 'desc' }, where: {
            ...(name && {
                OR: [
                    { firstname: { contains: name } },
                    { lastname: { contains: name } },
                ]
            })
        }
    });

    const total = await prisma.user.count();
    const totalPages = Math.ceil(total / take);

    return res.status(200).send({ customers, totalPages })
}))

module.exports = { customersRoute }