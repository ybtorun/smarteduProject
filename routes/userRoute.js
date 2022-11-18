const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/signup').post(authController.createUser); //http://localhost:3000/signup
router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.logoutUser); //http://localhost:3000/users/logout
router.route('/dashboard').get(authMiddleware, authController.getDashboardPage);  //http://localhost:3000/users/dashboard


// router.route('/').get(authController.getUsers);

module.exports = router;