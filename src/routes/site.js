const express = require('express');
const router = express.Router();

const siteController = require('../app/controller/SiteController');
const captchaController = require('../app/controller/CaptchaController');
const passwordResetController = require('../app/controller/PasswordResetController');
const verifycationController = require('../app/controller/VerifycationController');
const loginController = require('../app/controller/LoginController');
const signupController = require('../app/controller/SignupController');

// Login
router.post('/login', loginController.loginPost);
router.get('/login', loginController.loginGet);

// Signup
router.post('/signup', signupController.signupPost);
router.get('/signup', signupController.signupGet);

// Verifycation
router.get('/verify/:userId/:uniqueString', verifycationController.verify);
router.get('/verified', verifycationController.verified);

// PasswordReset
router.post('/passwordrr', passwordResetController.passwordrr);
router.get('/passwordrr', passwordResetController.getRequest);
router.post('/resetPassword', passwordResetController.resetPassword);
router.get('/resetPassword/:userId/:resetString', passwordResetController.getReset);

// Captcha
router.get('/captcha', captchaController.captcha);
router.get('/newCaptcha', captchaController.newCaptcha);

router.get('/home', siteController.index);

module.exports = router;