const { apiUnthorizedError, apiNotFoundError, apiForbiddenError } = require("../libs/errors/appError");
const { asyncError } = require("../libs/errors/asyncError");
const { verifyJwtToken } = require("../libs/helpers");
const { prisma } = require("../prismaClient");

function verifySalesToken(roles) {
    return asyncError(async (req, res, next) => {
        // check for cookie
        const tokenHead = req.cookies?.auth;

        if (!tokenHead) throw new apiUnthorizedError();

        if (!tokenHead.startsWith("Bearer ")) throw new apiUnthorizedError("this request required token");

        const token = tokenHead.split(" ")[1];

        const payload = await verifyJwtToken(token);

        if (!payload) throw new apiUnthorizedError("invalid token or expired");

        const user = await prisma.staffs.findFirst({ where: { email: payload?.email } });

        if (!user) throw new apiNotFoundError("user not found");

        // check if the roles includes the user role & if not block their access;

        if (!roles?.includes(user?.role)) {
            throw new apiForbiddenError("access denied")
        }

        // if everything is fine allow the next middlewares
        req.user = payload;
        next()

    })
}

module.exports = { verifySalesToken }