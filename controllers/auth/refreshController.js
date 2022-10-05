const Joi = require('joi')
const User = require('../../models/user')
const RefreshToken = require('../../models/refreshToken')
const CustomErrorHandler = require('../../services/CustomErrorHandler')
const JwtService = require('../../services/JwtService')




const refreshController = {
    async refresh(req, res, next) {
        // validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        });

        // schema options
        const options = {
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true // remove unknown props
        };

        const { error } = refreshSchema.validate(req.body, options);

        if (error) {
            return next(error);
        }

        // database
        let refreshtoken;
        try {
            refreshtoken = await RefreshToken.findOne({ token: req.body.refresh_token });
            if (!refreshtoken) {
                return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
            }

            let userId;
            try {
                const { _id } = await JwtService.verify(refreshtoken.token, process.env.REFRESH_SECRET);
                userId = _id;
            } catch (err) {
                return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
            }

            const user = await User.findOne({ _id: userId });
            if (!user) {
                return next(CustomErrorHandler.unAuthorized('No user found!'));
            }

            // tokens
            // Toekn
            const access_token = JwtService.sign({ _id: user._id, role: user.role });
            const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, '1y', process.env.REFRESH_SECRET);
            // database whitelist
            await RefreshToken.create({ token: refresh_token });
            res.json({ access_token, refresh_token });

        } catch (err) {
            return next(new Error('Something went wrong ' + err.message));
        }

    }
};

module.exports = refreshController;