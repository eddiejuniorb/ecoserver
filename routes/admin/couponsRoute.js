const couponsRoute = require('express').Router()
const { verifyJwtTokenAdmins } = require('../../middlewares/verifyToken');
const { asyncError } = require('../../libs/errors/asyncError');
const { prisma } = require('../../prismaClient');
const { apiBadRequestError, apiNotFoundError } = require('../../libs/errors/appError');





// Get Coupon
couponsRoute.get('/get', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const { id } = req.query;

    if (!id) throw new apiBadRequestError();

    const coupon = await prisma.coupon.findFirst({ where: { id: id } });

    if (!coupon) throw new apiNotFoundError();

    return res.status(200).send(coupon)

}))


// Get all coupon

couponsRoute.get('/all', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const coupons = await prisma.coupon.findMany({ orderBy: { start: 'desc' } })
    res.status(200).send(coupons)
}))


// Add coupon

couponsRoute.post('/add', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const { code, discount, end, minimum, active } = req.body

    if (!code || !discount || !end || !minimum || !active) {
        throw new apiBadRequestError("Fill the empty spaces")
    }

    if (await prisma.coupon.findFirst({ where: { code: code } })) {
        throw new apiBadRequestError("Coupon with this code already exist");
    }

    if (await prisma.coupon.create({
        data: {
            code: code,
            end: new Date(end).toISOString(),
            discount: parseFloat(discount),
            minimum: parseFloat(minimum),
            active: JSON.parse(active)
        }
    })) return res.status(200).send("Coupon Added");

    throw new apiBadRequestError("somthing happened")

}))


// Update Coupon

couponsRoute.post('/update', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const { id, code, discount, end, minimum, active } = req.body;

    if (!code || !discount || !end || !minimum || !active) {
        throw new apiBadRequestError("Fill the empty spaces")
    }

    if (!await prisma.coupon.findFirst({ where: { id: id } })) {
        throw new apiNotFoundError();
    }

    if (await prisma.coupon.update({
        where: { id: id },
        data: {
            code: code,
            end: new Date(end).toISOString(),
            discount: parseFloat(discount),
            minimum: parseFloat(minimum),
            active: JSON.parse(active)
        }
    })) return res.status(200).send("Coupon updated")

    throw new apiBadRequestError("somthing happened")
}))



// Delete Coupon

couponsRoute.delete('/delete', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const { id } = req.query;

    if (!id) throw new apiBadRequestError();

    if (!await prisma.coupon.findFirst({ where: { id: id } })) {
        throw new apiNotFoundError();
    }

    if (await prisma.coupon.delete({ where: { id: id } })) return res.sendStatus(200);

    throw new apiBadRequestError("somthing happened")
}))



// Change Status

couponsRoute.post('/change-active', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const { id } = req.body;
    if (!id) throw new apiBadRequestError();

    const coupon = await prisma.coupon.findFirst({ where: { id: id } });

    if (!coupon) {
        throw new apiNotFoundError();
    }

    if (await prisma.coupon.update({
        where: { id: id },
        data: {
            active: !coupon.active
        }
    })) return res.status(200).send("Coupon status updated")

    throw new apiBadRequestError("somthing happened")

}))

module.exports = { couponsRoute }