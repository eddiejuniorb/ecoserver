const mediaRoute = require('express').Router()
const { asyncError } = require('../../libs/errors/asyncError');
const { prisma } = require('../../prisma');
const { apiBadRequestError } = require('../../libs/errors/appError');
const fs = require('fs')




mediaRoute.get('/', asyncError(async (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            throw new apiBadRequestError("Error occured");
        }
        res.status(200).send(files)
        return
    })
}))


module.exports = { mediaRoute }