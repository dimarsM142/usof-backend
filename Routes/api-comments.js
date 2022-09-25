const express = require('express');
const router = express.Router();
const passport  = require('passport');

const { getCommentByID, getLikeByCommentID, postLikeByCommentID, patchCommentByID, patchLocking, deleteCommentByID, deleteLikeByCommentID } = require('../Controllers/api-comments-controller.js');


router.get('/api/comments/:comment_id', getCommentByID);//ТУТ МЕЙБІ ФІЛЬТР
router.get('/api/comments/:comment_id/like', getLikeByCommentID);
router.post('/api/comments/:comment_id/like', passport.authenticate('jwt', {session: false}), postLikeByCommentID);
router.patch('/api/comments/:comment_id', passport.authenticate('jwt', {session: false}), patchCommentByID);
router.patch('/api/comments/:comment_id/locking', passport.authenticate('jwt', {session: false}), patchLocking);
router.delete('/api/comments/:comment_id', passport.authenticate('jwt', {session: false}), deleteCommentByID);
router.delete('/api/comments/:comment_id/like', passport.authenticate('jwt', {session: false}), deleteLikeByCommentID);

module.exports = router;