const othersRoute = require('express').Router()
const { verifyToken, verifyJwtTokenAdmins } = require('../../middlewares/verifyToken');
const { asyncError } = require('../../libs/errors/asyncError');
const { apiBadRequestError, apiNotFoundError } = require('../../libs/errors/appError');
const { prisma } = require('../../prismaClient');


// Shipping
othersRoute.get('/shipping', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const resp = await prisma.shipping_cost.findMany()
    return res.status(200).send(resp)
}))

othersRoute.post('/shipping', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const { area_name, cost, id } = req.body;

    if (!area_name) throw new apiBadRequestError('fill the empty spaces');
    if (parseFloat(cost) < 0) throw new apiBadRequestError('incorrect cost');

    const findArea = await prisma.shipping_cost.findFirst({ where: { area_name: area_name } });
    if (!id && findArea) {
        throw new apiBadRequestError("destination already exists");
    }

    const add = await prisma.shipping_cost.upsert({
        where: { id: id || "" },
        create: { area_name: area_name, cost: parseFloat(cost) },
        update: { area_name: area_name, cost: parseFloat(cost) }
    })

    if (add) {
        res.sendStatus(200)
        return
    }

    throw new apiBadRequestError("something happened")
}))

othersRoute.delete('/shipping', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const { id } = req.query
    if (!id) throw new apiBadRequestError("provide id");

    if (!await prisma.shipping_cost.findFirst({ where: { id: id } })) throw new apiNotFoundError();

    const deleted = await prisma.shipping_cost.delete({ where: { id: id } })

    if (deleted) {
        res.status(200).send("deleted")
        return
    }
}))


// Terms and Conditions

othersRoute.get('/term-and-condition', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const resp = await prisma.termCondition.findMany()
    return res.status(200).send(resp[0] || { content: "" })
}))

othersRoute.post('/term-and-condition', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const { id, content } = req.body;

    if (!content) throw new apiBadRequestError("fill the empty space")

    const addorUpdated = await prisma.termCondition.upsert({
        where: { id: id || "" },
        create: { content },
        update: { content }
    })

    if (addorUpdated) {
        res.sendStatus(200)
        return
    }

    throw new apiBadRequestError("something happened")
}))


// Privacy

othersRoute.get('/privacy', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const resp = await prisma.privacyPolicy.findMany()
    return res.status(200).send(resp[0] || { content: "" })
}))

othersRoute.post('/privacy', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const { id, content } = req.body;

    if (!content) throw new apiBadRequestError("fill the empty space")

    const addorUpdated = await prisma.privacyPolicy.upsert({
        where: { id: id || "" },
        create: { content },
        update: { content }
    })

    if (addorUpdated) {
        res.sendStatus(200)
        return
    }

    throw new apiBadRequestError("something happened")
}))

module.exports = { othersRoute }