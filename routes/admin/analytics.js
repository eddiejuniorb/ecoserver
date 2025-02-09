const analyticsRoute = require('express').Router();
const { asyncError } = require('../../libs/errors/asyncError');
const { verifyJwtTokenAdmins } = require('../../middlewares/verifyToken');
const { prisma } = require('../../prismaClient');



analyticsRoute.get('/sales-summary', verifyJwtTokenAdmins.adminOnly(), asyncError(async (req, res) => {
    const analytics = await getSalesSummary();
    res.status(200).send({ data: analytics })
}))



// ===========================================  Today, Yesterday, This Month and Last Month ==============================================================



const getTodaySales = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0)

    const totalTodaySales = await prisma.order.aggregate({
        _sum: {
            total: true
        },

        where: {
            iat: {
                gte: today
            },
            payment_status: 'paid'
        }
    })

    return totalTodaySales._sum.total || 0;
}


const getYesterdaySales = async () => {
    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0)

    const endOfYesterday = new Date(today);
    endOfYesterday.setHours(0, 0, 0, 0);

    const totalYesterdaySales = await prisma.order.aggregate({
        _sum: {
            total: true
        },

        where: {
            iat: {
                gte: yesterday,
                lt: endOfYesterday
            },
            payment_status: 'paid'

        }
    })

    return totalYesterdaySales._sum.total || 0;
}


async function getThisMonthSales() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const totalThisMonthSales = await prisma.order.aggregate({
        _sum: {
            total: true,
        },
        where: {
            iat: {
                gte: startOfMonth,
            },
            payment_status: 'paid'
        },
    });

    return totalThisMonthSales._sum.total || 0;
}


async function getLastMonthSales() {
    const today = new Date();
    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);  // Last day of last month

    const totalLastMonthSales = await prisma.order.aggregate({
        _sum: {
            total: true,
        },
        where: {
            iat: {
                gte: startOfLastMonth,
                lt: startOfThisMonth,  // Less than the start of this month
            },
            payment_status: 'paid'
        },
    });

    return totalLastMonthSales._sum?.total || 0;
}

async function getAllTimeSales() {
    const all = await prisma.order.aggregate({
        _sum: {
            total: true
        }
        , where: {
            payment_status: 'paid'
        }
    })

    return all._sum.total || 0
}


async function getSalesSummary() {
    const today = await getTodaySales();
    const yesterday = await getYesterdaySales();
    const thismonth = await getThisMonthSales();
    const lastmonth = await getLastMonthSales();
    const alltime = await getAllTimeSales()

    return {
        today,
        yesterday,
        thismonth,
        lastmonth,
        alltime,
    };
}


// ===========================================  Today, Yesterday, This Month and Last Month ==============================================================




// ===========================================  Chart Data ==============================================================


module.exports = { analyticsRoute }