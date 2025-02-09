const shopRoute = require('express').Router()
const { asyncError } = require('../../libs/errors/asyncError');
const { prisma } = require('../../prismaClient');

// Shipping Costs

shopRoute.get('/shipping-cost', asyncError(async (req, res) => {
    const shipping_cost = await prisma.shipping_cost.findMany();
    return res.status(200).send(shipping_cost || [])
}))

// Hot Update
shopRoute.get('/hot-update', asyncError(async (req, res) => {
    const hot = await prisma.updateInfo.findFirst({ select: { message: true, enabled: true } });
    return res.status(200).send(hot || {})
}))


// Banner 
shopRoute.get('/banner', asyncError(async (req, res) => {
    const banner = await prisma.banner.findMany();
    return res.status(200).send(banner)
}))


// Small Header 
shopRoute.get('/small-header', asyncError(async (req, res) => {
    const header = await prisma.smallHeader.findFirst();
    return res.status(200).send(header || {})
}))

// Loactons 
shopRoute.get('/locations', asyncError(async (req, res) => {
    const our_shops = await prisma.our_shop.findMany();
    return res.status(200).send(our_shops || [])
}))

// Hot Sale 
shopRoute.get('/hot-sales', asyncError(async (req, res) => {
    const hotSales = await prisma.on_sales.findMany()
    return res.status(200).send(hotSales)
}))

// Faqs 
shopRoute.get('/faq', asyncError(async (req, res) => {
    const faqs = await prisma.faqs.findMany()
    return res.status(200).send(faqs)
}))

// Privacy Policy
shopRoute.get('/privacy-policy', asyncError(async (req, res) => {
    const privacy_policy = await prisma.privacyPolicy.findFirst();
    return res.status(200).send(privacy_policy || {})
}))

// Privacy Policy
shopRoute.get('/term-and-condition', asyncError(async (req, res) => {
    const term_and_condition = await prisma.termCondition.findFirst();
    return res.status(200).send(term_and_condition || {})
}))

module.exports = { shopRoute }