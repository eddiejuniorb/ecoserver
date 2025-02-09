const adminApiGateWay = require('express').Router();
const { categoryRoute } = require('../routes/admin/categoryAdminRoute');
const { productAdminRoute } = require('../routes/admin/productAdminRoute');
const { authAdmin } = require('../routes/admin/auth');
const { analyticsRoute } = require('../routes/admin/analytics');
const { mediaRoute } = require('../routes/admin/media');
const { downloadRoute } = require('../routes/admin/downloadRoute');
const { couponsRoute } = require('../routes/admin/couponsRoute');
const { ordersRoute } = require('../routes/admin/ordersRoute');
const { customersRoute } = require('../routes/admin/customersRoute');
const { storeRoute } = require('../routes/admin/storeRoute');
const { settingRoute } = require('../routes/admin/settingRoute');
const { staffsRoute } = require('../routes/admin/staffsRoute');
const { othersRoute } = require('../routes/admin/othersRoute');
const { shopRoute } = require('../routes/admin/shopRoute');
const { offersAdminRoute } = require('../routes/admin/offer');
const { bestSellingRoute } = require('../routes/admin/bestSelling');


adminApiGateWay.use('/category', categoryRoute);
adminApiGateWay.use('/product', productAdminRoute);
adminApiGateWay.use('/auth', authAdmin)
adminApiGateWay.use('/analytics', analyticsRoute);
adminApiGateWay.use('/info', bestSellingRoute);
adminApiGateWay.use('/media', mediaRoute)
adminApiGateWay.use('/download', downloadRoute)
adminApiGateWay.use('/coupon', couponsRoute);
adminApiGateWay.use('/order', ordersRoute);
adminApiGateWay.use('/customer', customersRoute)
adminApiGateWay.use('/staff', staffsRoute)
adminApiGateWay.use('/store', storeRoute)
adminApiGateWay.use('/other', othersRoute)
adminApiGateWay.use('/setting', settingRoute)
adminApiGateWay.use('/shop', shopRoute)
adminApiGateWay.use('/offer', offersAdminRoute)

module.exports = { adminApiGateWay }
