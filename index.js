require('dotenv').config()
require('./jobs/cartCleanupCron')
const express = require('express');
const http = require('http')
const { apiNotFoundError, BaseError, apiBadRequestError } = require('./libs/errors/appError');
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
const { sendEmail } = require('./services/mail');
const { prisma } = require('./prisma');


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
            origin: ["http://localhost:3000", "http://localhost:3001"],
        })
    );



    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(fileUpload())
    app.use(cookieParser());

    app.use(session({
        secret: process.env.jwt_secret,
        saveUninitialized: false,
        resave: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24
        }
    }))


    app.post('/upload', upload.single, asyncError(async (req, res) => {
        const images = req.images
        res.status(200).send(images)
    }))

    app.get('/', asyncError((req, res) => {
        throw new apiNotFoundError("Not found")
    }))

    // serve images to the client
    app.use('/images', express.static('uploads'))


    // Application Routes
    app.use('/admin', adminApiGateWay);
    app.use('/client', clientApiGateWay)

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

        sendEmail({
            from: "contact@ecoshoppegh.com",
            to: process.env.contact_email,
            subject: "Error on Server",
            text: error,

        }, (err, data) => {
            if (err) {
                console.log(err);
                return
            }
            return;
        })

        return res.status(500).send("internal server error");
    })

    prisma.$connect().then(() => {
        console.log("Database Connected Successfully");
    }).catch(e => {
        console.log("Database Connection Error: ", e);
    })


    server.listen(port, () => {
        console.log(`Server is up and running on port ${port}`);
    })

}
