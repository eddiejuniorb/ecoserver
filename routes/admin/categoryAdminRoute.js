const categoryRoute = require('express').Router();
const { asyncError } = require('../../libs/errors/asyncError');
const { prisma } = require('../../prismaClient');
const { apiBadRequestError, apiNotFoundError } = require('../../libs/errors/appError');
const { verifyJwtTokenAdmins } = require('../../middlewares/verifyToken');


categoryRoute.get('/get/:id', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const id = req.params?.id;
    if (!id) throw new apiBadRequestError()
    const category = await prisma.category.findFirst({ where: { id: id } });
    if (!category) throw new apiNotFoundError("no category found")
    res.status(200).send(category)
}))

// Get All
categoryRoute.get('/all', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const allData = await prisma.category.findMany({
        include: { Subcategory: true },
        orderBy: { iat: 'desc' },
    });
    return res.status(200).send({ data: allData })
})
)

// Add Category;
categoryRoute.post('/add', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {

    const { name, image } = req.body;

    if (!name) {
        throw new apiBadRequestError("fill the empty space");
    }

    if (await prisma.category.findFirst({ where: { name: name } })) {
        throw new apiBadRequestError("category name already exists")
    };

    const payload = { name: name?.trim(), image: image?.trim() };

    if (await prisma.category.create({ data: { ...payload } })) {
        return res.sendStatus(200);
    }

    throw new apiBadRequestError("something occured")
})
);

// Update Category
categoryRoute.put('/update', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {

    const { id, name, image } = req.body;

    if (!id) {
        throw new apiBadRequestError("Provide Category ID")
    }

    const payload = { name: name?.trim(), image: image?.trim() };

    if (await prisma.category.update({ where: { id: id }, data: { ...payload } })) {
        res.sendStatus(200);
        return;
    }
    throw new apiBadRequestError("something occured")
})
);

// Delete category
categoryRoute.delete('/delete', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {

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


// subcategories functions ===========================================================================================================================================================


categoryRoute.post('/subcategory', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {

    const { name, categoryId } = req.body;

    if (!name || !categoryId) throw new apiBadRequestError("fill the empty spaces");

    const findSubCategory = await prisma.subcategory.findFirst({
        where: {
            name: name,
            categoryId: categoryId
        }
    })

    if (findSubCategory) throw new apiBadRequestError("Subcategory name under this category exists");

    await prisma.subcategory.create({
        data: {
            name: name,
            categoryId: categoryId
        }
    })

    return res.sendStatus(200)

}))

categoryRoute.get('/subcategory/:id', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const category_id = String(req.params.id)
    const subcategories = await prisma.subcategory.findMany({
        where: {
            categoryId: category_id
        },
        include: { Product: true }
    })
    return res.status(200).send(subcategories)
}))

categoryRoute.delete('/subcategory', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const id = String(req.query.id);
    const findSubCategory = await prisma.subcategory.findFirst({
        where: {
            id: id
        }
    })

    if (!findSubCategory) throw new apiNotFoundError("No subcategory found");

    await prisma.subcategory.delete({ where: { id: id } })

    return res.sendStatus(200)
}))

// functions and others

const addSubcategories = ({ parentId, name }) => {
    return new Promise((resolve, reject) => {
        prisma.subcategory.create({
            data: {
                name: name,
                categoryId: parentId
            }
        }).then((res) => {
            resolve("Category Added")
        })
    })
}