const express = require('express');
const route = express.Router()
const { loginController, registerController, userController, refreshController, productController } = require('../controllers');
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')


// authentication
route.post('/register', registerController.register)
route.post('/login', loginController.login)
route.get('/me', auth, userController.me)
route.post('/refresh', refreshController.refresh);
route.post('/logout', auth, loginController.logout);

// product database

// add item by admin
// route.post('/products', auth, productController.store);
route.post('/products', [auth, admin], productController.store);
route.put('/products/:id', [auth, admin], productController.update);
route.delete('/products/:id', [auth, admin], productController.destroy);

// router.post('/products/cart-items', productController.getProducts);

// router.get('/products', productController.index);
// router.get('/products/:id', productController.show);



module.exports = route
// export default router;