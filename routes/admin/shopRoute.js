const shopRoute = require('express').Router()
const { verifyJwtTokenAdmins } = require('../../middlewares/verifyToken');
const { asyncError } = require('../../libs/errors/asyncError');
const { prisma } = require('../../prismaClient');
const { apiBadRequestError, apiNotFoundError } = require('../../libs/errors/appError');


shopRoute.get('/', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const resp = await prisma.our_shop.findMany({ orderBy: { iat: 'desc' } })
    return res.status(200).send(resp)
}))


shopRoute.post('/', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const { name, image, address, telephone, email, time_avalable1, time_avalable2, google_address_link, id } = req.body;

    if (!name || !image || !address || !telephone || !email || !time_avalable1 || !google_address_link)
        throw new apiBadRequestError("fill the empty spaces");

    if (!id && await prisma.our_shop.findFirst({ where: { name: name } })) {
        throw new apiBadRequestError("location already exists")
    }

    const addOrUpdate = await prisma.our_shop.upsert({
        where: { id: id || "" },
        create: {
            name, image, address, telephone, email, time_avalable1, time_avalable2, google_address_link
        },
        update: {
            name, image, address, telephone, email, time_avalable1, time_avalable2, google_address_link
        }
    })

    if (addOrUpdate) {
        return res.sendStatus(200)
    }

    throw new apiBadRequestError("something happened")

}))


shopRoute.delete('/', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const { id } = req.query
    if (!id) throw new apiBadRequestError("provide id");

    if (!await prisma.our_shop.findFirst({ where: { id: id } })) throw new apiNotFoundError();

    const deleted = await prisma.our_shop.delete({ where: { id: id } })

    if (deleted) {
        res.status(200).send("deleted")
        return
    }
}))


module.exports = { shopRoute }