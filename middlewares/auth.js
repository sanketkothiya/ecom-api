const CustomErrorHandler = require("../services/CustomErrorHandler")
const JwtService = require("../services/JwtService")
const jwt = require('jsonwebtoken')


const auth = async (req, res, next) => {
    let authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader) {
        return next(CustomErrorHandler.unAuthorized());
    }

    const token = authHeader.split(' ')[1];
    console.log(token)

    try {
        // const { _id, role } = await JwtService.verify(token);
        const { _id, role } = await jwt.verify(token, process.env.JWT_SECRET);
        const user = {
            _id,
            role
        }
        req.user = user;
        next();

    } catch (err) {
        return next(CustomErrorHandler.unAuthorized());
    }

}

module.exports = auth;