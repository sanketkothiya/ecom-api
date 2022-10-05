const express = require('express');
const route = express.Router()
const { loginController, registerController, userController, refreshController } = require('../controllers');
const auth = require('../middlewares/auth')



route.post('/register', registerController.register)
route.post('/login', loginController.login)
route.get('/me', auth, userController.me)
// router.post('/refresh', refreshController.refresh);

module.exports = route
// export default router;