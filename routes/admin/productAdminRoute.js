const productAdminRoute = require('express').Router();
const { asyncError } = require('../../libs/errors/asyncError');
const { verifyToken } = require('../../middlewares/verifyToken');
const { apiBadRequestError, apiNotFoundError } = require('../../libs/errors/appError');
const { slugify } = require('../../libs/helpers');
const { prisma } = require('../../prismaClient');


// get product

productAdminRoute.get('/get/:slug', verifyToken(['admin'], 'admin'), asyncError(async (req, res) => {
    const slug = req.params?.slug;
    if (!slug) throw new apiBadRequestError("product slug required");

    const result = await prisma.product.findFirst({
        where: { slug: slug }, include: { variants: true, category: { select: { name: true } } }
    })

    if (!result) throw new apiNotFoundError('no product fount');

    let product = [result]

    const filtedProduct = product.map(pro => {

        const productHasVariant = pro.variants.length ? true : false

        return {
            id: pro?.id,
            name: pro?.name,
            images: JSON.parse(pro.images),
            discount: pro?.discount,
            description: pro?.description,
            variants: pro?.variants,
            category: pro?.category_id,
            base_price: pro?.base_price,
            productHasVariant: productHasVariant,
            customable: pro?.customable,
            publish: pro?.publish,
            stock: pro?.stock,
            categoryList: pro?.category,
            customise_price: pro?.customise_price,
        }
    })

    res.status(200).send(filtedProduct[0])

}))


// Get All Product
productAdminRoute.get('/all', verifyToken(['admin', 'cashier'], 'admin'), asyncError(async (req, res) => {

    const { page, limit, name } = req.query;

    const skip = (page - 1) * limit;
    const take = parseInt(limit)

    let products = await prisma.product.findMany({
        orderBy: { 'iat': 'desc' },
        include: { category: { select: { name: true, id: true } } },
        take,
        skip,
        where: {
            ...(name && {
                OR: [
                    { name: { contains: name } },
                ]
            })
        }
    })

    const total = await prisma.product.count();
    const totalPages = Math.ceil(total / take)

    const filteredProducts = products?.map(product => {

        const instock = product?.stock < 1 ? false : true;

        return {
            id: product?.id,
            name: product?.name,
            description: product?.description,
            stock: product?.stock,
            discount: product?.discount,
            image: JSON.parse(product?.images)[0],
            customised: product?.customable,
            publish: product?.publish,
            instock: instock,
            category: product?.category,
            base_price: product?.base_price,
            slug: product?.slug,
            customise_price: product?.customise_price
        }
    })

    res.status(200).send({ products: filteredProducts, totalPages })
}))








// Add product

productAdminRoute.post('/add', verifyToken(['admin', 'cashier'], 'admin'), asyncError(async (req, res) => {

    const
        {
            name,
            has_variants,
            description,
            base_price,
            stock,
            discount,
            customable,
            category,
            images,
            variants,
            customise_price
        } = req.body;


    if (!JSON.parse(images)?.length) {
        throw new apiBadRequestError('images required');
    }

    const productNameExist = await prisma.product.findFirst({ where: { name: name } });

    if (productNameExist) throw new apiBadRequestError('product name already exists');

    if (!name || !description || !base_price
        || !stock || !category
        || !discount || !customable || !customise_price) {
        throw new apiBadRequestError("fill the empty spaces")
    }


    if (parseFloat(discount) > 100) {
        throw new apiBadRequestError("Discount cannot be greater than 100")
    }

    const isCustomable = JSON.parse(customable)

    let product;

    if (JSON.parse(variants)?.length) {
        const v = JSON.parse(variants)?.map((variant) => {
            return {
                image: variant?.image?.trim(),
                size: variant?.size?.trim(),
                color: variant?.color?.trim(),
                material: variant?.material?.trim(),
                type: variant?.type?.trim(),
                stock: parseInt(variant?.stock),
                price: parseFloat(variant?.price),
            }
        })

        product = await prisma.product.create({
            data: {
                name: name,
                description: description,
                stock: parseInt(stock),
                images: images,
                base_price: parseFloat(base_price),
                discount: parseInt(discount),
                customable: isCustomable,
                category_id: category,
                customise_price: parseFloat(customise_price),
                slug: slugify(name),
                variants: {
                    create: v
                }
            }
        })


    } else {
        product = await prisma.product.create({
            data: {
                name: name,
                description: description,
                stock: parseInt(stock),
                images: images,
                base_price: parseFloat(base_price),
                discount: parseInt(discount),
                customable: isCustomable,
                category_id: category,
                customise_price: parseFloat(customise_price),
                slug: slugify(name),
            }
        })
    }


    if (product) {
        res.status(200).send({ message: "product added" });
        return;
    }

    throw new apiBadRequestError('something occured');

}));







// Update product

productAdminRoute.post('/update/:id', verifyToken(['admin', 'cashier'], 'admin'), asyncError(async (req, res) => {

    const productId = req.params?.id

    if (!productId) throw new apiBadRequestError("provide product id");

    const productFound = await prisma.product.findFirst({ where: { id: productId } })

    if (!productFound) throw new apiNotFoundError("no product found");

    const
        {
            name,
            description,
            base_price,
            stock,
            publish,
            discount,
            category,
            customable,
            customise_price,
            images,

        } = req.body;

    if (!name || !description || !base_price || !stock || !images || !category || !publish || !discount || !customable || !customise_price) {
        throw new apiBadRequestError("fill the empty spaces")
    }

    const updatedProduct = await prisma.product.update({
        where: { id: productFound?.id },
        data: {
            name: name,
            description: description,
            base_price: parseFloat(base_price),
            images: images,
            stock: parseInt(stock),
            discount: parseInt(discount),
            publish: JSON.parse(publish),
            category_id: category,
            customable: JSON.parse(customable),
            slug: slugify(name),
            customise_price: parseFloat(customise_price)
        }
    })

    if (updatedProduct) {
        res.status(200).send({ message: "product updated successfully" })
        return;
    }

    throw new apiBadRequestError("Something bad happen")
})
);

// Delete product
productAdminRoute.delete('/delete', verifyToken(['admin'], 'admin'), asyncError(async (req, res) => {
    const product_id = req.query?.product_id;
    const productFound = await prisma.product.findFirst({ where: { id: product_id } });

    if (!productFound) throw new apiNotFoundError("No product found");

    if (await prisma.product.delete({ where: { id: product_id } })) {
        res.sendStatus(200);
        return;
    }

    throw new apiBadRequestError("something occured");
})
);


// Change customised
productAdminRoute.post('/change', verifyToken(['admin', 'cashier'], 'admin'), asyncError(async (req, res) => {
    const { target, id } = req?.query
    if (!target) throw new apiBadRequestError();

    const product = await prisma.product.findFirst({ where: { id: id } })
    if (!product) throw new apiNotFoundError();

    if (target === 'customise') {
        await prisma.product.update({ where: { id: id }, data: { customable: !product.customable } })
        return res.sendStatus(200)
    } else if (target === 'publish') {
        await prisma.product.update({ where: { id: id }, data: { publish: !product.publish } })
        return res.sendStatus(200)
    } else {
        throw new apiBadRequestError()
    }

}))

module.exports = { productAdminRoute }