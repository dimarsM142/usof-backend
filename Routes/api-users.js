const express = require('express');
const router = express.Router();
const passport  = require('passport');

const {getUsers, getUserID, getUserMe, postUsers, patchUsersAvatarMe, patchUsersAvatarByID, patchUsersID, patchUsersMe ,deleteUsersID, deleteUsersMe, getUsersAvatarMe, getUserAvatarLogin} = require('../Controllers/api-users-controller');



router.get('/api/users', passport.authenticate('jwt', {session: false}), getUsers);//ТУТ СОРТ І ФІЛЬТР
router.get('/api/users/:id', passport.authenticate('jwt', {session: false}), getUserID);//ТУТ МЕЙБІ ФІЛЬТР
router.get('/api/users/avatar/:login', getUserAvatarLogin);//ТУТ МЕЙБІ ФІЛЬТР
router.get('/api/me/users', passport.authenticate('jwt', {session: false}), getUserMe);//ТУТ МЕЙБІ ФІЛЬТР
router.post('/api/users', passport.authenticate('jwt', {session: false}), postUsers);
router.get('/api/users/me/avatar', passport.authenticate('jwt', {session: false}), getUsersAvatarMe);
router.patch('/api/users/me/avatar', passport.authenticate('jwt', {session: false}), patchUsersAvatarMe);
router.patch('/api/users/avatar/:id', passport.authenticate('jwt', {session: false}), patchUsersAvatarByID);
router.patch('/api/users/:id', passport.authenticate('jwt', {session: false}), patchUsersID);
router.patch('/api/me/users', passport.authenticate('jwt', {session: false}), patchUsersMe);
router.delete('/api/users/:id', passport.authenticate('jwt', {session: false}), deleteUsersID);
router.delete('/api/me/users', passport.authenticate('jwt', {session: false}), deleteUsersMe);

module.exports = router;