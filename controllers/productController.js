const Product = require('../models/product');
const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })
const path = require('path')
const fs = require('fs')
const Joi = require('joi')
const CustomErrorHandler = require('../services/CustomErrorHandler')
const productSchema = require('../validators/productValidator')


// console.log("enter in productcontroller")

const { dirname } = require('path');
const appDir = dirname(require.main.filename);
// console.log(appDir)

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        // 3746674586-836534453.png
        cb(null, uniqueName);
    },
});

const handleMultipartData = multer({
    storage,
    limits: { fileSize: 1000000 * 5 },
}).single('image'); // 5mb image header ma use karvu 


// method 2 for upload
// const upload = multer({
//     storage: multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, 'uploads')
//         },
//         filename: function (req, file, cb) {
//             cb(null, file.fieldname + "-" + Date.now() + `${path.extname(file.originalname)}`)
//         },
//         limits: { fileSize: 1000000 * 5 }
//     })
// }).single('image')



const productController = {
    async store(req, res, next) {
        // Multipart form data
        handleMultipartData(req, res, async (err) => {
            if (err) {
                console.log("error");
                return next(CustomErrorHandler.serverError(err.message));
            }
            const filePath = req.file.path;
            // console.log(req.file)



            // schema options
            const options = {
                abortEarly: false, // include all errors
                allowUnknown: true, // ignore unknown props
                stripUnknown: true // remove unknown props
            };

            // validation
            const { error } = productSchema.validate(req.body, options);
            if (error) {
                // Delete the uploaded file
                fs.unlink(`${appDir}/${filePath}`, (err) => {
                    if (err) {
                        return next(
                            CustomErrorHandler.serverError(err.message)
                        );
                    }
                });
                return next(error);
                // rootfolder/uploads/filename.png
            }

            const { name, price, size } = req.body;
            let document;
            try {
                document = await Product.create({
                    name,
                    price,
                    size,
                    image: filePath,
                });
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
            // res.json({})
        });
    }
    ,
    update(req, res, next) {
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            let filePath;
            if (req.file) {
                filePath = req.file.path;
            }
            // schema options
            const options = {
                abortEarly: false, // include all errors
                allowUnknown: true, // ignore unknown props
                stripUnknown: true // remove unknown props
            };

            // validation
            const { error } = productSchema.validate(req.body, options);
            if (error) {
                // Delete the uploaded file
                if (req.file) {
                    fs.unlink(`${appDir}/${filePath}`, (err) => {
                        if (err) {
                            return next(
                                CustomErrorHandler.serverError(err.message)
                            );
                        }
                    });
                }

                return next(error);
                // rootfolder/uploads/filename.png
            }

            const { name, price, size } = req.body;
            let document;
            try {
                document = await Product.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        name,
                        price,
                        size,
                        ...(req.file && { image: filePath }),
                    },
                    { new: true }
                );
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
        });
    }
    ,
    async destroy(req, res, next) {
        const document = await Product.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        // image delete
        const imagePath = document.image;
        // http://localhost:5000/uploads/1616444052539-425006577.png
        // approot/http://localhost:5000/uploads/1616444052539-425006577.png
        fs.unlink(`${appDir}/${imagePath}`, (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError());
            }
            return res.json(document);
        });
    }
    // ,
    // async index(req, res, next) {
    //     let documents;
    //     // pagination mongoose-pagination
    //     try {
    //         documents = await Product.find()
    //             .select('-updatedAt -__v')
    //             .sort({ _id: -1 });
    //     } catch (err) {
    //         return next(CustomErrorHandler.serverError());
    //     }
    //     return res.json(documents);
    // },
    // async show(req, res, next) {
    //     let document;
    //     try {
    //         document = await Product.findOne({ _id: req.params.id }).select(
    //             '-updatedAt -__v'
    //         );
    //     } catch (err) {
    //         return next(CustomErrorHandler.serverError());
    //     }
    //     return res.json(document);
    // },
    // async getProducts(req, res, next) {
    //     let documents;
    //     try {
    //         documents = await Product.find({
    //             _id: { $in: req.body.ids },
    //         }).select('-updatedAt -__v');
    //     } catch (err) {
    //         return next(CustomErrorHandler.serverError());
    //     }
    //     return res.json(documents);
    // },
};

module.exports = productController;
