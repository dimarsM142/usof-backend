const express = require('express');
const router = express.Router();
const passport  = require('passport');

const {postRegister, postLogin, postRefresh, postLogout, postSendPassword, postResetPassword} = require('../Controllers/api-authorization-controller.js');


router.post('/api/auth/register', postRegister);
router.post('/api/auth/login/', postLogin);
router.post('/api/auth/refresh', postRefresh);
router.post('/api/auth/logout', passport.authenticate('jwt', {session: false}), postLogout);
router.post('/api/auth/password-reset', postSendPassword);
router.post('/api/auth/password-reset/:token', postResetPassword);

module.exports = router;