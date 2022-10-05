const express = require('express');
const route = express.Router()
const { loginController, registerController, userController, refreshController } = require('../controllers');
const auth = require('../middlewares/auth')



route.post('/register', registerController.register)
route.post('/login', loginController.login)
route.get('/me', auth, userController.me)
route.post('/refresh', refreshController.refresh);
route.post('/logout', auth, loginController.logout);


module.exports = route
// export default router;