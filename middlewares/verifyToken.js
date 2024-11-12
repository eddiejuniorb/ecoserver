const { apiBadRequestError, apiForbiddenError, apiNotFoundError, apiUnthorizedError } = require("../libs/errors/appError");
const { asyncError } = require("../libs/errors/asyncError");
const { verifyJwtToken } = require("../libs/helpers");
const { prisma } = require("../prismaClient");


const verifyToken = (role, target) => {
    return asyncError(async (req, res, next) => {
        const tokenHeader = req.cookies?.auth || req.headers?.auth;
        if (!tokenHeader) throw new apiUnthorizedError();
        if (!tokenHeader.startsWith('Bearer ')) throw new apiUnthorizedError("bad token");

        const token = tokenHeader.split(" ")[1];
        const payload = await verifyJwtToken(token);
        if (!payload) throw new apiBadRequestError("token expired or invalid");

        if (target === 'admin') {

            const admin = await prisma.staffs.findFirst({ where: { email: payload?.email } })

            if (!admin) {
                throw new apiNotFoundError("No user found")
            }

            if (!role.includes(admin?.role)) {
                throw new apiForbiddenError('access denied');
            }

            req.user = payload
            next()
            return
        } else {
            const user = await prisma.user.findFirst({ where: { email: payload?.email } });

            if (!user) {
                throw new apiNotFoundError("No user found")
            }

            if (!role.includes(user?.role)) {
                throw new apiForbiddenError('access denied');
            }

            req.user = payload;

            next();
            return;
        }
    })
}

module.exports = { verifyToken }