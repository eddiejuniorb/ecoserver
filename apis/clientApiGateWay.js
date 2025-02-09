const clientApiGateWay = require('express').Router();
const { productClientRoute } = require('../routes/client/productClientRoute');
const { categoryClientRoute } = require('../routes/client/categoryClientRoute');
const { authRoute } = require('../routes/client/auth');
const { addressRoute } = require('../routes/client/addressRoute');
const { wishlistRoute } = require('../routes/client/wishlistRoute');
const { cartRoute } = require('../routes/client/cartRoute');
const { searchRoute } = require('../routes/client/searchRoute');
const { paymentRoute } = require('../routes/client/paymentRoute');
const { shopRoute } = require('../routes/client/shopRoute');
const { orderRoute } = require('../routes/client/orderRoute');
const { utilityRoute } = require('../routes/client/utility');
const { contactRoute } = require('../routes/client/contact');
const { trackRoute } = require('../routes/client/track');
const { offersClient } = require('../routes/client/offer');



// auth
clientApiGateWay.use('/auth', authRoute)

// get all categories
clientApiGateWay.use('/category', categoryClientRoute);

// products
clientApiGateWay.use('/product', productClientRoute);

//address
clientApiGateWay.use('/address', addressRoute)

// whislist
clientApiGateWay.use('/wishlist', wishlistRoute)

// cart
clientApiGateWay.use('/cart', cartRoute)

// search
clientApiGateWay.use('/search', searchRoute)

// payment
clientApiGateWay.use('/payment', paymentRoute)

// shop
clientApiGateWay.use('/shop', shopRoute)

// order
clientApiGateWay.use('/order', orderRoute)

// Shop Sidebar
clientApiGateWay.use('/utility', utilityRoute)

// contact 
clientApiGateWay.use('/contact', contactRoute)

// track 
clientApiGateWay.use('/track', trackRoute)

// offers
clientApiGateWay.use('/offer', offersClient)

module.exports = { clientApiGateWay }