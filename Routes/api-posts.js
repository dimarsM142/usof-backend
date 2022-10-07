const express = require('express');
const router = express.Router();
const passport  = require('passport');

const {getPosts, getPostByID, getPostByIDComments, postCommentToPost, getCategoriesToPost, getLikesOnPost, postNewPost, postLikeToPost, patchPost, deletePost, deleteLikeOnPost, patchStatus, patchLocking, getFavourite, postFavourite, deleteFavourite, getSubscribe, postSubscribe, deleteSubscribe} = require('../Controllers/api-posts-controller');

router.get('/api/posts', getPosts);
router.get('/api/posts/:post_id', getPostByID);
router.get('/api/posts/:post_id/comments', getPostByIDComments);
router.post('/api/posts/:post_id/comments', passport.authenticate('jwt', {session: false}), postCommentToPost);
router.get('/api/posts/:post_id/categories', getCategoriesToPost);
router.post('/api/posts', passport.authenticate('jwt', {session: false}), postNewPost);

router.patch('/api/posts/:post_id', passport.authenticate('jwt', {session: false}), patchPost);
router.patch('/api/posts/:post_id/status', passport.authenticate('jwt', {session: false}), patchStatus);
router.patch('/api/posts/:post_id/locking', passport.authenticate('jwt', {session: false}), patchLocking);
router.delete('/api/posts/:post_id', passport.authenticate('jwt', {session: false}), deletePost);


router.get('/api/posts/:post_id/like', getLikesOnPost);
router.post('/api/posts/:post_id/like', passport.authenticate('jwt', {session: false}), postLikeToPost);
router.delete('/api/posts/:post_id/like', passport.authenticate('jwt', {session: false}), deleteLikeOnPost);
router.get('/api/posts/:post_id/favourite', getFavourite);//ЗАГАЛЬНОДОСТУПНИМ
router.post('/api/posts/:post_id/favourite', passport.authenticate('jwt', {session: false}),  postFavourite);
router.delete('/api/posts/:post_id/favourite', passport.authenticate('jwt', {session: false}), deleteFavourite);
router.get('/api/posts/:post_id/subscribe', getSubscribe);//ЗАГАЛЬНОДОСТУПНИМ
router.post('/api/posts/:post_id/subscribe', passport.authenticate('jwt', {session: false}), postSubscribe);
router.delete('/api/posts/:post_id/subscribe', passport.authenticate('jwt', {session: false}), deleteSubscribe);





module.exports = router;