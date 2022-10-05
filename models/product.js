
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// import { APP_URL } from '../config';
// const APP_URL = process.env.APP_URL;



const productSchema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        size: { type: String, required: true },
        image: {
            type: String,
            required: true
            // get: (image) => {
            //     // http://localhost:5000/uploads/1616443169266-52350494.png
            //     if (process.env.ON_HEROKU == 'true') {
            //         return `${image}`;
            //     }
            //     return `${APP_URL}/${image}`;
            // },
        },
    },
    // { timestamps: true, toJSON: { getters: true }, id: false }
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema, 'products');
