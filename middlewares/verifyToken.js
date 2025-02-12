
const { apiBadRequestError, apiForbiddenError, apiNotFoundError, apiUnthorizedError } = require("../libs/errors/appError");
const { asyncError } = require("../libs/errors/asyncError");
const { verifyJwtToken } = require("../libs/helpers");
const { prisma } = require("../prismaClient");


class baseTokenMiddleware {

    static async verifyTokenAndRole(token, role, model) {
        const payload = await verifyJwtToken(token);
        if (!payload) throw new apiBadRequestError("token expired or invalid");

        const user = await prisma[model].findFirst({ where: { email: payload?.email } })

console.log(payload,user);
        if (!user) {
            throw new apiNotFoundError("No user found")
        }

        if (!role.includes(user?.role)) {
            throw new apiForbiddenError('access denied');
        }

        return payload;

    }

    static verify(role, target) {
        return asyncError(async (req, res, next) => {
            const tokenHeader = req.cookies?.auth || req.headers?.auth;
console.log(tokenHeader)            
if (!tokenHeader) throw new apiUnthorizedError();
            if (!tokenHeader.startsWith('Bearer ')) throw new apiUnthorizedError("bad token");

            const token = tokenHeader.split(" ")[1];
            const model = target === "admin" ? "staffs" : target === "client" ? "user" : null;
            if (!model) throw new apiForbiddenError("unknown authentication method");

            req.user = await this.verifyTokenAndRole(token, role, model)
            next()
        })
    }

    static adminsTarget(role) {
        return baseTokenMiddleware.verify(role, "admin")
    }

    static clientsTarget(role) {
        return baseTokenMiddleware.verify(role, "client")
    }
}



class verifyJwtTokenAdmins extends baseTokenMiddleware {
    static adminOnly() {
        return super.adminsTarget(["admin"])
    }
    static allAudience() {
        return super.adminsTarget(['admin', 'cashier', 'operator'])
    }
    static adminCashier() {
        return super.adminsTarget(['admin', 'cashier'])
    }
    static adminOperator() {
        return super.adminsTarget(['admin', 'operator'])
    }
}


class verifyJwtTokenClients extends baseTokenMiddleware {
    static clientOnly() {
        return super.clientsTarget(["user"])
    }
}


module.exports = { verifyJwtTokenClients, verifyJwtTokenAdmins }
