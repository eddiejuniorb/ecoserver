const { asyncError } = require('../../libs/errors/asyncError');

const bundleAdminRoute = require('express').Router();


bundleAdminRoute.post('/', asyncError(async (req, res) => {

}))