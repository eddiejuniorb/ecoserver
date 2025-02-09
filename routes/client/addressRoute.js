const addressRoute = require('express').Router();
const { verifyToken, verifyJwtTokenClients } = require('../../middlewares/verifyToken');
const { asyncError } = require('../../libs/errors/asyncError');
const { apiBadRequestError, apiForbiddenError } = require('../../libs/errors/appError');
const { prisma } = require('../../prismaClient');

addressRoute.post('/add', verifyJwtTokenClients.clientOnly(), asyncError(async (req, res) => {

    const userID = req?.user?.user_id;

    const { firstname, lastname, company, address_1, address_2, city, country, phone } = req.body;

    if (!firstname || !address_1 || !city || !country || !phone) {
        throw new apiBadRequestError("fill the empty spaces");
    }

    if (await prisma.address.create({
        data: {
            firstname: firstname,
            lastname: lastname,
            company: company,
            country: country,
            user_id: userID,
            AddressOne: address_1,
            AdressTwo: address_2,
            city: city,
            phone: phone
        }
    })) {
        res.sendStatus(200)
        return
    }

    throw new apiBadRequestError('something happen')

}))


addressRoute.delete('/delete', verifyJwtTokenClients.clientOnly(), asyncError(async (req, res) => {
    const userID = req?.user?.user_id;
    const addressID = req.query?.id;

    if (!addressID || !await prisma.address.findFirst({ where: { id: addressID } }))
        throw new apiBadRequestError("no address found");

    if (await prisma.address.delete({
        where: {
            id: addressID, user_id: userID
        }
    })) {
        return res.sendStatus(200)
    }

    throw new apiBadRequestError('something happened')


}))

module.exports = { addressRoute }