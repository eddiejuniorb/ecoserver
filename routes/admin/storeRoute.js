const storeRoute = require('express').Router()
const { verifyJwtTokenAdmins } = require('../../middlewares/verifyToken');
const { asyncError } = require('../../libs/errors/asyncError');
const { prisma } = require('../../prismaClient');
const { apiBadRequestError, apiNotFoundError } = require('../../libs/errors/appError');


// Hot Update

storeRoute.get('/hot-update', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const resp = await prisma.updateInfo.findMany();
    return res.status(200).send(resp[0] || { message: "", enabled: false })
}))

storeRoute.post('/hot-update', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const { enabled, message, id } = req.body
    if (!message) {
        throw new apiBadRequestError("Fill the empty spaces")
    }

    const add = await prisma.updateInfo.upsert({
        where: { id: id || "" },
        create: { message: message, enabled: enabled },
        update: { message: message, enabled: enabled }
    })

    if (add) {
        res.sendStatus(200)
        return
    }

    throw new apiBadRequestError("something happened")

}))


// Small Headers

storeRoute.get('/header', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const resp = await prisma.smallHeader.findMany({ orderBy: { iat: 'desc' } })
    return res.status(200).send(resp)
}))

storeRoute.post('/header', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const { data } = req.body

    if (!data) throw new apiBadRequestError("provide data");

    const formData = JSON.parse(data);

    for (const data of formData) {

        if (!data?.title || !data?.link_name || !data?.link_url) {
            throw new apiBadRequestError("Fill the empty spaces")
        }

        await prisma.smallHeader.upsert({
            where: { id: data?.id || "" },
            update: {
                title: data?.title,
                link_name: data?.link_name,
                link_url: data?.link_url
            },
            create: {
                title: data?.title,
                link_name: data?.link_name,
                link_url: data?.link_url
            }
        })
    }

    return res.sendStatus(200)
}))



// Banners =========================================================================================================

storeRoute.get('/banner', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const resp = await prisma.banner.findMany()
    return res.status(200).send(resp)
}))

storeRoute.post('/banner', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const { data } = req.body

    if (!data) throw new apiBadRequestError("provide data");

    const formData = JSON.parse(data);

    for (const data of formData) {

        if (!data?.title || !data?.sub_title || !data?.description || !data?.image || !data?.link_name || !data?.link_url) {
            throw new apiBadRequestError("Fill the empty spaces")
        }

        await prisma.banner.upsert({
            where: { id: data?.id || "" },
            update: {
                title: data?.title,
                sub_title: data?.sub_title,
                description: data?.description,
                image: data?.image,
                link_name: data?.link_name,
                link_url: data?.link_url
            },
            create: {
                title: data?.title,
                sub_title: data?.sub_title,
                description: data?.description,
                image: data?.image,
                link_name: data?.link_name,
                link_url: data?.link_url
            },
        })


    }

    return res.sendStatus(200)

}))



// on sales route ==================================================================================================

storeRoute.get('/on-sale', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const resp = await prisma.on_sales.findMany({ orderBy: { iat: 'desc' } });
    return res.status(200).send(resp)
}))

storeRoute.post('/on-sale', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const { data } = req.body

    if (!data) throw new apiBadRequestError("provide data");

    const formData = JSON.parse(data);

    for (const data of formData) {

        if (!data?.title || !data?.sub_title || !data?.description || !data?.image || !data?.link_name || !data?.link_url) {
            throw new apiBadRequestError("Fill the empty spaces")
        }

        await prisma.on_sales.upsert({
            where: { id: data?.id || "" },
            update: {
                title: data?.title,
                sub_title: data?.sub_title,
                description: data?.description,
                image: data?.image,
                link_name: data?.link_name,
                link_url: data?.link_url
            },
            create: {
                title: data?.title,
                sub_title: data?.sub_title,
                description: data?.description,
                image: data?.image,
                link_name: data?.link_name,
                link_url: data?.link_url
            },
        })
    }

    return res.sendStatus(200)
}))



// promotional route =====================================================================================

storeRoute.get('/promotional', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const resp = await prisma.promotional.findMany();
    return res.status(200).send(resp)
}))

storeRoute.post('/promotional', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const { title, description, link_name, link_url, image, id } = req.body;

    if (!image || !title || !description || !link_name || !link_url) throw new apiBadRequestError("fill the empty spaces");


    if (id && await prisma.promotional.update({
        where: { id: id }, data: {
            image: image,
            link_url: link_url,
            link_name: link_name,
            description: description,
            title: title,
        }
    })) return res.status(200).send("promotional updated")

    if (await prisma.promotional.create({
        data: {
            image: image,
            link_url: link_url,
            link_name: link_name,
            description: description,
            title: title,
        }
    })) return res.status(200).send("promotional added")

    throw new apiBadRequestError("something happened")

}))


// FAQs

storeRoute.get('/faq', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const faqs = await prisma.faqs.findMany({ orderBy: { iat: 'desc' } })
    res.status(200).send(faqs)
    return
}))


storeRoute.post('/faq', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const { id, question, answer } = req.body

    if (!question || !answer) {
        throw new apiBadRequestError("fill the empty spaces")
    }

    const addorUpdated = await prisma.faqs.upsert({
        where: { id: id || "" },
        update: {
            question: question,
            answer: answer
        },
        create: {
            question: question,
            answer: answer
        }
    })

    if (addorUpdated) {
        res.sendStatus(200)
        return
    }

    throw new apiBadRequestError("something happened")
}))

storeRoute.delete('/faq', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const { id } = req.query
    if (!id) throw new apiBadRequestError("provide id");

    if (!await prisma.faqs.findFirst({ where: { id: id } })) throw new apiNotFoundError("no faq found");

    const deleted = await prisma.faqs.delete({ where: { id: id } })

    if (deleted) {
        res.status(200).send("Faq deleted")
        return
    }

}))



// SEO DATA 

storeRoute.get('/seo', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const resp = await prisma.seo.findMany()
    return res.status(200).send(resp[0] || {
        favicon: "", meta_title: "", meta_description: "", meta_url: "",
        meta_keywords: "", meta_image: "",
    })
}))

storeRoute.post('/seo', verifyJwtTokenAdmins.adminCashier(), asyncError(async (req, res) => {
    const { favicon, meta_title, meta_description, meta_url, meta_keywords, meta_image, id } = req.body;

    if (!favicon || !meta_title || !meta_description || !meta_url || !meta_keywords || !meta_image) throw new apiBadRequestError("fill the empty spaces");

    if (id && await prisma.seo.update({
        where: { id: id }, data: {
            favicon: favicon,
            meta_description: meta_description,
            meta_image: meta_image,
            meta_keywords: meta_keywords,
            meta_title: meta_title,
            meta_url: meta_url,
        }
    })) return res.status(200).send("seo updated")

    if (await prisma.seo.create({
        data: {
            favicon: favicon,
            meta_description: meta_description,
            meta_image: meta_image,
            meta_keywords: meta_keywords,
            meta_title: meta_title,
            meta_url: meta_url,
        }
    })) return res.status(200).send("seo added")

    throw new apiBadRequestError("something happened")

}))


// Store Settings

storeRoute.get('/store-settings', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const resp = await prisma.storeSetting.findFirst()
    return res.status(200).send(resp || { cash_on_delivery: true, paystack: true })
}))

storeRoute.post('/store-settings', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const { cash_on_delivery, paystack, id } = req.body;

    const addorUpdated = await prisma.storeSetting.upsert({
        where: { id: id || "" },
        create: { cash_on_delivery: JSON.parse(cash_on_delivery), paystack: JSON.parse(paystack) },
        update: { cash_on_delivery: JSON.parse(cash_on_delivery), paystack: JSON.parse(paystack) }
    })

    if (addorUpdated) {
        return res.sendStatus(200)

    }
    throw new apiBadRequestError("something happened")
}))


module.exports = { storeRoute }