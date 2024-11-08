const categoryRoute = require('express').Router();
const { asyncError } = require('../../libs/errors/asyncError');
const { verifyToken } = require('../../middlewares/verifyToken');
const { prisma } = require('../../prisma');
const { apiBadRequestError, apiNotFoundError } = require('../../libs/errors/appError');


categoryRoute.get('/get/:id', verifyToken(['admin', 'cashier'], 'admin'), asyncError(async (req, res) => {
    const id = req.params?.id;
    if (!id) throw new apiBadRequestError()
    const category = await prisma.category.findFirst({ where: { id: id } });
    if (!category) throw new apiNotFoundError("no category found")
    res.status(200).send(category)
}))

// Get All
categoryRoute.get(
    '/all', verifyToken(['admin', 'cashier'], 'admin'), asyncError(async (req, res) => {
        const allData = await prisma.category.findMany({
            select: { name: true, id: true, image: true, _count: { select: { products: true } } },
            orderBy: { iat: 'desc' },
        });
        return res.status(200).send({ data: allData })
    })
)

// Add Category;
categoryRoute.post('/add', verifyToken(['admin', 'cashier'], 'admin'), asyncError(async (req, res) => {

    const { name, image } = req.body;

    if (!name) {
        throw new apiBadRequestError("fill the empty space");
    }

    if (await prisma.category.findFirst({ where: { name: name } })) {
        throw new apiBadRequestError("category name already exists")
    };

    const payload = { name, image: image };

    if (await prisma.category.create({ data: { ...payload } })) {
        return res.sendStatus(200);
    }

    throw new apiBadRequestError("something occured")
})
);

// Update Category
categoryRoute.put('/update', verifyToken(['admin', 'cashier'], 'admin'), asyncError(async (req, res) => {

    const { id, name, image } = req.body;

    if (!id) {
        throw new apiBadRequestError("Provide Category ID")
    }

    const payload = { name, image: image };

    if (await prisma.category.update({ where: { id: id }, data: { ...payload } })) {
        res.sendStatus(200);
        return;
    }
    throw new apiBadRequestError("something occured")
})
);

// Delete category
categoryRoute.delete('/delete', verifyToken(['admin', 'cashier'], 'admin'), asyncError(async (req, res) => {

    const id = req.query?.id;

    if (!id) throw new apiBadRequestError("provide category id");

    if (await prisma.category.delete({ where: { id: id } })) {
        res.sendStatus(200);
        return;
    }
    throw new apiBadRequestError("something occured")

})
);

module.exports = { categoryRoute }