const Joi = require('joi')

const productSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    size: Joi.string().required(),
    image: Joi.string(),
});

module.exports = productSchema;