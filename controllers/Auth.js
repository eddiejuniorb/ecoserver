const { apiBadRequestError } = require("../libs/errors/appError");
const { asyncError } = require("../libs/errors/asyncError");
const { setAuthCookie, generateToken, comaparePassword, emailRegex } = require("../libs/helpers");
const { prisma } = require("../prismaClient");

class AuthController {
    static login(model) {
        return asyncError(async (req, res) => {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new apiBadRequestError("fill the empty spaces")
            }

            if (!emailRegex.test(email)) {
                throw new apiBadRequestError("invalid email")
            }

            const user = await prisma[model].findFirst({ where: { email: email } });

            if (!user || !await comaparePassword(password, user?.password)) {
                throw new apiBadRequestError("You have entered incorrect email or password");
            }

            const token = await generateToken({ user_id: user?.id, email: user?.email });
            const maxAge = 14 * 24 * 60 * 60 * 1000;

            setAuthCookie({ res: res, token: token, maxAge: maxAge })

            return res.status(200).send({ token })
        })
    }


    static adminAuthLogin() {
        return AuthController.login('staffs')
    }

    static clientAuthLogin() {
        return AuthController.login('user')
    }

    static logout() {
        return asyncError(async (req, res) => {
            res.clearCookie('auth', { maxAge: 0 })
            res.sendStatus(200)
            return;
        })
    }
}


module.exports = { AuthController }
