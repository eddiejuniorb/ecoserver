const { apiBadRequestError, apiNotFoundError } = require('../../libs/errors/appError');
const { asyncError } = require('../../libs/errors/asyncError');
const { verifyJwtTokenAdmins } = require('../../middlewares/verifyToken');
const { prisma } = require('../../prismaClient');

const offersClient = require('express').Router();

// get special offer
offersClient.get('/special', asyncError(async (req, res) => {
    const offer = await prisma.specialOffer.findFirst({
        orderBy: { iat: 'desc' }, include: {
            product: { select: { dealEnd: true, slug: true } }
        }
    })
    return res.status(200).send(offer)
}))

module.exports = { offersClient }