const express = require('express');
const {getFavorites, getFavorite, addFavorite, deleteFavorite} = require('../controllers/favorites');
const router = express.Router({mergeParams:true});
const {protect, authorize}= require('../middleware/auth');
router.route('/').get(protect, getFavorites).post(protect, authorize('admin','user'), addFavorite);
router.route('/:id').get(protect, getFavorite).delete(protect, authorize('admin','user'), deleteFavorite);
module.exports=router;