const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

router.route('/signup').post( [
    body('name').not().isEmpty().withMessage('Please Enter Your Name'),//isim girip girilmediğini kontrol eder

    body('email').isEmail().withMessage('Please Enter Valid Email')
    .custom((userEmail) => {//email adresinin olup olmadığını kontrol ettik.
        return User.findOne({email:userEmail}).then(user => {
            if(user) {
                return Promise.reject(`${userEmail} is already exists!`)
            }
        })
    }),

    body('password').not().isEmpty().withMessage('Please Enter A Password'),//parola girip girilmediğini kontrol

],authController.createUser); //http://localhost:3000/signup

router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.logoutUser); //http://localhost:3000/users/logout
router.route('/dashboard').get(authMiddleware, authController.getDashboardPage);  //http://localhost:3000/users/dashboard


// router.route('/').get(authController.getUsers);

module.exports = router;