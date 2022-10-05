const express = require('express');
const route = express.Router()
const { loginController, registerController, userController, refreshController, productController } = require('../controllers');
const auth = require('../middlewares/auth')


// authentication
route.post('/register', registerController.register)
route.post('/login', loginController.login)
route.get('/me', auth, userController.me)
route.post('/refresh', refreshController.refresh);
route.post('/logout', auth, loginController.logout);

// product database

route.post('/products', productController.store);

// router.post('/products/cart-items', productController.getProducts);

// router.post('/products', [auth, admin], productController.store);
// router.put('/products/:id', [auth, admin], productController.update);
// router.delete('/products/:id', [auth, admin], productController.destroy);
// router.get('/products', productController.index);
// router.get('/products/:id', productController.show);



module.exports = route
// export default router;