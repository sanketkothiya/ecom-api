// export {default as registerController} from './auth/registerController'
const registerController = require('./auth/registerController')
const loginController = require('./auth/loginController')
const userController = require('./auth/userController')
const refreshController = require('./auth/refreshController')
const productController = require('./productController')

module.exports = { registerController, loginController, userController, refreshController, productController };