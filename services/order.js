const { prisma } = require("../prismaClient");

let orderClients = [];

let lastOrderId = 0;

function notifyClients(order) {
    for (client of orderClients) {
        client.res.write("data: new order received\n\n")
    }
}

// const checkForNewOrder = async () => {
//     try {
//         // const lastOrder = await prisma.order.findFirst({
//         //     orderBy: { iat: 'desc' },
//         //     include: {
//         //         User: { select: { firstname: true, lastname: true } }
//         //     }
//         // });

//         // if (lastOrder && lastOrder.id !== lastOrderId) {
//         //     lastOrderId = lastOrder.id;
//         notifyClients()
//         // }

//     } catch (error) {
//         console.log("Error Occured", error);
//     }
// }


// setInterval(checkForNewOrder, 5000);


module.exports = { orderClients, notifyClients }