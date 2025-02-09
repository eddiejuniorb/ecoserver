const { authRoutes } = require('../routes/sales/auth');
const { customersRoute } = require('../routes/sales/customersRoute');
const { orderRoute } = require('../routes/sales/ordersRoute');

const orderApiGateway = require('express').Router();


orderApiGateway.use('/order', orderRoute);
orderApiGateway.use('/customer', customersRoute);
orderApiGateway.use('/auth', authRoutes);



module.exports = { orderApiGateway }