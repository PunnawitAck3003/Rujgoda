const express = require('express');
const {getPromotions, getPromotion, addPromotion, updatePromotion, deletePromotion} = require('../controllers/promotions');
const router = express.Router({mergeParams:true});
const {protect, authorize}= require('../middleware/auth');

router.route('/').get(protect, getPromotions).post(protect, authorize('admin','user'), addPromotion);
router.route('/:id').get(protect, getPromotion).put(protect, authorize('admin','user'),updatePromotion).delete(protect, authorize('admin','user'), deletePromotion);

module.exports=router;