const Joi = require('joi')
const User = require('../../models/user')
const User = require('../../models/user')
const bcrypt = require('bcrypt')
const CustomErrorHandler = require('../../services/CustomErrorHandler')
const JwtService = require('../../services/JwtService')


const registerController = {
    async register(req, res, next) {

        // validation
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')
        });

        // schema options
        const options = {
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true // remove unknown props
        };
        // show body data
        // console.log(req.body);

        const { error } = registerSchema.validate(req.body, options);
        if (error) {
            return next(error);
        }
        // check if user is in the database already
        try {
            const exist = await User.exists({ email: req.body.email });
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('This email is already taken.'));
            }
        } catch (err) {
            return next(err);
        }
        const { name, email, password } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // prepare the model

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        let access_token;
        try {
            const result = await user.save();
            console.log(result);

            // Token
            access_token = JwtService.sign({ _id: result._id, role: result.role });
            if (access_token) {
                res.json({ access_token: access_token });
            }

        } catch (err) {
            return next(err);
        }


        // res.json({ access_token:access_token });

    }
}

module.exports = registerController;


// 2nd single pass value in controller
// exports.register=(req,res)=>{
//     res.json({name:"sanket"})

// }