const { AuthController } = require("../../controllers/Auth");
const { asyncError } = require("../../libs/errors/asyncError");
const { verifyJwtTokenAdmins } = require("../../middlewares/verifyToken");
const { prisma } = require("../../prismaClient");
const authRoutes = require("express").Router();



authRoutes.post('/login', AuthController.adminAuthLogin())

authRoutes.get('/logout', AuthController.logout())

authRoutes.get('/user', verifyJwtTokenAdmins.allAudience(), asyncError(async (req, res) => {
    const { user_id } = req.user;
    const user = await prisma.staffs.findFirst({ where: { id: user_id } })
    return res.status(200).send(user || {})
}))

authRoutes.get('/verify', verifyJwtTokenAdmins.allAudience(), (req, res) => {
    return res.sendStatus(200)
})



module.exports = { authRoutes }