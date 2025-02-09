const utilityRoute = require('express').Router();
const { asyncError } = require('../../libs/errors/asyncError');
const { prisma } = require('../../prismaClient');
const { apiNotFoundError } = require('../../libs/errors/appError');


utilityRoute.get('/get-all', asyncError(async (req, res) => {
    const allvariants = await prisma.variants.findMany({
        select: { id: true, size: true, color: true, stock: true, price: true, material: true, type: true },
    })

    const variants = allvariants.reduce((acc, variant) => {
        // Group by color
        if (!acc.colors.includes(variant.color?.trim()) && variant.color !== "") {
            acc.colors.push(variant.color?.trim());
        }

        // Group by size
        if (!acc.sizes.includes(variant.size?.trim()) && variant?.size !== "") {
            acc.sizes.push(variant.size?.trim());
        }

        // Group by material
        if (!acc.materials.includes(variant.material?.trim()) && variant?.material !== "") {
            acc.materials.push(variant.material?.trim());
        }

        // Group by type
        if (!acc.types.includes(variant.type?.trim()) && variant.type !== "") {
            acc.types.push(variant.type?.trim());
        }

        return acc;
    }, {
        colors: [],
        sizes: [],
        materials: [],
        types: []
    });


    const categories = await prisma.category.findMany({
        select: {
            name: true, id: true,
            _count: {
                select: { Subcategory: true }
            }
        },
    })

    const filtered = categories.filter(cat => cat?._count?.products > 0)

    return res.status(200).send({ categories, variants })

}))



// Get Products By Craterias



utilityRoute.get('/collections/shop', asyncError(async (req, res) => {

    const { color, size, material, type, sort_by, page, min_price, max_price } = req.query;

    const colorFilter = color ? Array.isArray(color) ? color : [color] : []
    const sizeFilter = size ? Array.isArray(size) ? size : [size] : [];
    const materialFilter = material ? Array.isArray(material) ? material : [material] : [];
    const typeFilter = type ? Array.isArray(type) ? type : [type] : []

    let sortBy = "name", identifyer = "asc"

    switch (sort_by) {
        case "title-ascending":
            sortBy = "name";
            identifyer = "asc"
            break;

        case "title-descending":
            sortBy = "name";
            identifyer = "desc"
            break;

        case "price-ascending":
            sortBy = "base_price";
            identifyer = "asc"
            break;

        case "price-descending":
            sortBy = "base_price";
            identifyer = "desc"
            break;

        case "created-ascending":
            sortBy = "iat";
            identifyer = "asc"
            break;

        case "created-descending":
            sortBy = "iat";
            identifyer = "desc"
            break;
        default:
            sortBy = "name";
            identifyer = "asc"
            break;
    }

    // Algorigthm for pagination
    const pageNumber = page ? page : 1
    const take = 12;
    const skip = (pageNumber - 1) * take;


    // Build the OR conditions based on available filters
    const variantConditions = [];
    if (colorFilter.length) variantConditions.push({ color: { in: colorFilter } });
    if (sizeFilter.length) variantConditions.push({ size: { in: sizeFilter } });
    if (materialFilter.length) variantConditions.push({ material: { in: materialFilter } });
    if (typeFilter.length) variantConditions.push({ type: { in: typeFilter } });

    // for price

    const min_pricee = min_price ? parseFloat(min_price) : 0; // Default to 0
    const max_pricee = max_price ? parseFloat(max_price) : 5478965874547; // Default to no upper 



    // Query products with Prisma
    const products = await prisma.product.findMany({
        where: {
            OR: [
                {
                    variants: {
                        some: {
                            OR: variantConditions.length > 0 ? variantConditions : undefined
                        },
                    },
                },
                variantConditions.length === 0 ? {
                    variants: { none: {} }

                } : {}
            ],
            base_price: {
                gte: min_pricee,
                lte: max_pricee
            }
        },
        orderBy: { [sortBy]: identifyer },
        include: { variants: true },
        take: take,
        skip: skip,
    });


    const total = await prisma.product.count()
    const totalPages = Math.ceil(total / take)


    res.status(200).send({ products, totalPages })
}))






// Get Products By CAtegory Craterias


utilityRoute.get('/collections/product-category/:category', asyncError(async (req, res) => {

    const cat = req.params?.category

    const { sort_by, page, min_price, max_price } = req.query;

    if (!cat) throw new apiNotFoundError("provide category name")

    // Category Data
    const category = await prisma.category.findFirst({ where: { name: cat?.trim() }, include: { Subcategory: true } })

    if (!category) {
        return res.status(200).send({ products: [], totalPages: 0 })
    }

    // Build the OR conditions based on available filters
    const variantConditions = [];

    // for price

    const min_pricee = min_price ? parseFloat(min_price) : 0; // Default to 0
    const max_pricee = max_price ? parseFloat(max_price) : 5478965874547; // Default to no upper 

    let sortBy = "name", identifyer = "asc"

    switch (sort_by) {
        case "title-ascending":
            sortBy = "name";
            identifyer = "asc"
            break;

        case "title-descending":
            sortBy = "name";
            identifyer = "desc"
            break;

        case "price-ascending":
            sortBy = "base_price";
            identifyer = "asc"
            break;

        case "price-descending":
            sortBy = "base_price";
            identifyer = "desc"
            break;

        case "created-ascending":
            sortBy = "iat";
            identifyer = "asc"
            break;

        case "created-descending":
            sortBy = "iat";
            identifyer = "desc"
            break;
        default:
            sortBy = "name";
            identifyer = "asc"
            break;
    }

    // Paginations Algorithm

    const pageNumber = page ? page : 1
    const take = 12;
    const skip = (pageNumber - 1) * take;


    // Query products with Prisma
    const products = await prisma.product.findMany({
        where: {
            OR: [
                {
                    variants: {
                        some: {
                            OR: variantConditions.length > 0 ? variantConditions : undefined
                        },
                    },
                },
                variantConditions.length === 0 ? {
                    variants: { none: {} }

                } : {}
            ],
            base_price: {
                gte: min_pricee,
                lte: max_pricee
            }
        },
        orderBy: { [sortBy]: identifyer },
        include: { variants: true },
        take: take,
        skip: skip,
    });

    const subCategoriesIDs = [...category.Subcategory?.flatMap(cat => cat?.id)]

    const filtered = products.filter(product => subCategoriesIDs.includes(product?.subcategoryId))

    const total = await prisma.product.count({ where: {} })
    const totalPages = Math.ceil(total / take)


    res.status(200).send({ products: filtered, totalPages })
}))


module.exports = { utilityRoute }