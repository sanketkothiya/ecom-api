const Joi = require('joi')
const User = require('../../models/user')
const RefreshToken = require('../../models/refreshToken')
const CustomErrorHandler = require('../../services/CustomErrorHandler')
const bcrypt = require('bcrypt')
const JwtService = require('../../services/JwtService')


// import Joi from 'joi';
// import { User, RefreshToken } from '../../models';
// import CustomErrorHandler from '../../services/CustomErrorHandler';
// import bcrypt from 'bcrypt';
// import JwtService from '../../services/JwtService';
// import { REFRESH_SECRET } from '../../config';

const loginController = {
    async login(req, res, next) {
        // Validation
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        });
        // schema options
        const options = {
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true // remove unknown props
        };
        const { error } = loginSchema.validate(req.body, options);

        if (error) {
            return next(error);
        }

        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return next(CustomErrorHandler.wrongCredentials());
            }
            // compare the password
            const match = await bcrypt.compare(req.body.password, user.password);
            if (!match) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            // Toekn
            const access_token = JwtService.sign({ _id: user._id, role: user.role });
            const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, '1y', process.env.REFRESH_SECRET);
            // database whitelist
            await RefreshToken.create({ token: refresh_token });
            res.json({ access_token, refresh_token });


        } catch (err) {
            return next(err);
        }
        console.log('done');

    }
};


module.exports = loginController;