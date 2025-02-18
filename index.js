require('dotenv').config()
require('./jobs/cartCleanupCron')
require('./services/order')
require('./services/eventEmitter')
const express = require('express');
const http = require('http')
const { apiNotFoundError, BaseError } = require('./libs/errors/appError');
const { asyncError } = require('./libs/errors/asyncError');
const bodyParser = require('body-parser');
const { adminApiGateWay } = require('./apis/adminApiGateWay');
const { clientApiGateWay } = require('./apis/clientApiGateWay');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const fileUpload = require('express-fileupload')
const { upload } = require('./middlewares/files')
const session = require('express-session');
const cluster = require('cluster');
const os = require('os')
const { prisma } = require('./prismaClient');
const { orderApiGateway } = require('./apis/orderApiGateway');
const Logger = require('./libs/Logger');

const logger = new Logger('./logs/app.log', 'info')

const numCPUs = os.cpus().length

if (cluster.isPrimary) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }


    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        // Optionally restart worker
    });


} else {

    const app = express();
    const server = http.createServer(app)

    const port = process.env.PORT || 5000;

    app.use(
        cors({
            credentials: true,
            origin: ["https://www.ecoshoppegh.com", "https://ecoshoppegh.com", "http://localhost:3000",
                "https://admin.ecoshoppegh.com", "https://orders.ecoshoppegh.com"],
        })
    );


    app.disable('x-powered-by');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(fileUpload())
    app.use(cookieParser());


    app.use(session({
        secret: process.env.jwt_secret,
        saveUninitialized: false,
        resave: false,
    }))

    // SSE client for sales




    app.post('/upload', upload.single, asyncError(async (req, res) => {
        const images = req.images
        res.status(200).send(images)
    }))



    app.use('/images', (req, res, next) => {
        // Check if the requested file is an image
        if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(req.url)) {
            // Set cache-control header for images
            res.setHeader('Cache-Control', 'public, max-age=869400, immutable');
        }
        next(); // Proceed to serve the static files
    });

    // serve images to the client
    app.use('/images', express.static('uploads'), (req, res) => {
        res.setHeader('Cache-Control', 'public, max-age=31536000')
    })


    // Application Routes
    app.use('/admin', adminApiGateWay);
    app.use('/client', clientApiGateWay)
    app.use('/sales', orderApiGateway)


    // Server health
    app.get('/health-check', (req, res) => {
        res.sendStatus(200)
    })


    app.all("*", asyncError((req, res) => {
        throw new apiNotFoundError("URL not found")
    }))


    app.use((error, req, res, next) => {
        if (error instanceof BaseError && error.isOperational) {
            return res.status(error.statusCode).send(error.message);
        }

        console.error(error);

        logger.error("Internal Server Error", {
            stack: error.stack,
            method: req.method,
            path: req.originalUrl,
        })

        return res.status(500).send("internal server error");
    })

    prisma.$connect().then(() => {
        console.log("Database Connected Successfully");
    }).catch(e => {
        console.log("Database Connection Error: ", e);
        logger.critical("Database Connection Error", {
            message: e?.message,
            error: e?.stack,
        })
    })

    server.listen(port, () => {
        console.log(`Server is up and running on port ${port}`);
    })

}
