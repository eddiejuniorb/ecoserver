const { apiBadRequestError, apiNotFoundError } = require('../../libs/errors/appError');
const { asyncError } = require('../../libs/errors/asyncError');
const { verifyJwtTokenAdmins } = require('../../middlewares/verifyToken');
const { prisma } = require('../../prismaClient');

const offersAdminRoute = require('express').Router();

// get special offer
offersAdminRoute.get('/special', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const offer = await prisma.specialOffer.findFirst({ orderBy: { iat: 'desc' } })
    return res.status(200).send(offer ||
    {
        id: "",
        title: "",
        image: "",
        description: "",
        productId: ""
    })
}))

offersAdminRoute.post('/special', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {

    const { id, title, image, description, productId } = req.body;

    if (!title || !image || !description || !productId) {
        throw new apiBadRequestError('fill the empty spaces')
    }

    const product = await prisma.product.findFirst({ where: { id: productId } })

    if (!product) throw new apiNotFoundError("no product found");

    await prisma.specialOffer.upsert({
        where: { id: id || "" },
        create: {
            title: title,
            description: description,
            image: image,
            productId: productId
        },
        update: {
            title: title,
            description: description,
            image: image,
            productId: productId
        }
    })

    return res.sendStatus(200)
}))

module.exports = { offersAdminRoute }