const path = require("path");
const { apiBadRequestError } = require("../libs/errors/appError");
const { asyncError } = require("../libs/errors/asyncError");
const { UploadedFile } = require('express-fileupload')


const filePayload = () => {
    return asyncError((req, res, next) => {
        if (!req.files) {
            throw new apiBadRequestError("Files required");
        }
    })
}

const allowedExtensions = [".jpeg", ".png", ".webp", ".jpg", ".mp4"];
const maxSize = 5 * 1024 * 1024;


const upload = {
    single: (req, res, next) => {
        if (!req.files) {
            throw new apiBadRequestError("file is required")
        }

        const files = Array.isArray(req.files?.file) ? req.files?.file : [req.files?.file]


        // Check extensions
        const unsoportedFiles = [];

        Object.keys(files).forEach(key => {
            const file = files[key];

            const ext = path.extname(file.name);

            if (!allowedExtensions.includes(ext)) {
                unsoportedFiles.push(file.name);
            }
        })

        if (unsoportedFiles.length) {
            res.status(500).send("unsoported files")
            return;
        }

        // Check sizes
        const overSizeFiles = [];

        Object.keys(files).forEach(key => {
            const file = files[key];
            if (file.size > maxSize) {
                overSizeFiles.push(file.name)
            }
        })

        if (overSizeFiles.length) {
            res.status(500).send("File size exceeds 5 MB limit.")
            return;
        }

        // upload the the

        const errorFiles = []
        const images = []

        Object.keys(files).forEach(key => {
            const file = files[key];
            file.mv(`uploads/${file.name}`, (err) => {
                if (err) {
                    errorFiles.push(file.name);
                }
            })
            images.push(file.name)
        })

        if (errorFiles.length) {
            res.status(500).send("error while saving file.")
            return;
        }

        req.images = images
        next()
    },

}


module.exports = { upload, filePayload }