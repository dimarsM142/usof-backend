const express = require('express');
const router = express.Router();
const passport  = require('passport');

const { getCategories, getCategoryByID, getPostsByCategoryID, postCategory, patchCategory, deleteCategory } = require('../Controllers/api-categories-controller.js');

router.get('/api/categories', getCategories);
router.get('/api/categories/:category_id', getCategoryByID);
router.get('/api/categories/:category_id/posts', getPostsByCategoryID);
router.post('/api/categories', passport.authenticate('jwt', {session: false}), postCategory);
router.patch('/api/categories/:category_id', passport.authenticate('jwt', {session: false}), patchCategory);
router.delete('/api/categories/:category_id', passport.authenticate('jwt', {session: false}), deleteCategory);

module.exports = router;