const downloadRoute = require('express').Router()
const { asyncError } = require('../../libs/errors/asyncError');
const { apiBadRequestError } = require('../../libs/errors/appError');
const { prisma } = require('../../prismaClient');
const { Parser } = require('json2csv');
const { verifyJwtTokenAdmins } = require('../../middlewares/verifyToken');


downloadRoute.get('/', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const target = req?.query?.target;

    let result = []

    if (!target) {
        throw new apiBadRequestError("no target found")
    }

    if (target === 'products') {
        result = await prisma.product.findMany({ include: { variants: true } });
    } else if (target === "categories") {
        result = await prisma.category.findMany()
    } else if (target === "coupons") {
        result = await prisma.coupon.findMany()
    } else if (target === "orders") {
        result = await prisma.order.findMany({ include: { User: { select: { firstname: true } } } })
    } else if (target === "users") {
        result = await prisma.user.findMany({ include: { _count: { select: { orders: true } } } })
    } else if (target === "staffs") {
        result = await prisma.staffs.findMany()
    }
    else {
        throw new apiBadRequestError('Bad Request');
    }


    if (!result.length) {
        throw new apiBadRequestError("No data found");
    }

    const json2csvParser = new Parser()
    const csv = json2csvParser.parse(result);

    res.setHeader('Content-Type', 'text/cvs')
    res.setHeader('Content-Disposition', `attachment; filename=${target}.csv`);

    res.status(200).send(csv)
}))

module.exports = { downloadRoute }