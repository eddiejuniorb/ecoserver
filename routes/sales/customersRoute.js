const { apiBadRequestError, apiNotFoundError } = require('../../libs/errors/appError');
const { asyncError } = require('../../libs/errors/asyncError');
const { prisma } = require('../../prismaClient');

const customersRoute = require('express').Router();



customersRoute.get('/', asyncError(async (req, res) => {

    const { cus_name, page } = req.query;

    const pageNumber = page ? page : 1
    const take = 50;
    const skip = (pageNumber - 1) * take;


    const filter = {};

    if (cus_name) {
        filter.OR = [{ firstname: { contains: cus_name } }, { lastname: { contains: cus_name } }]
    }

    const customers = await prisma.user.findMany({
        where: filter,
        include: { orders: true, address: true },
        orderBy: { iat: 'desc' },
        take,
        skip
    })

    const total = await prisma.user.count({ where: filter })
    const totalPages = Math.ceil(total / take)


    return res.status(200).send({ data: customers, totalPages })
}))



customersRoute.get('/:id', asyncError(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new apiBadRequestError()

    const customer = await prisma.user.findFirst({
        where: { id: id },
        include: { orders: { orderBy: { iat: 'desc' } }, address: true }
    })

    if (!customer) throw new apiNotFoundError('no customer found');

    return res.status(200).send(customer || {})

}))




module.exports = { customersRoute }
