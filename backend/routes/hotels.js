const express = require('express');
const {getHotels, getHotel, createHotel, updateHotel, deleteHotel} = require('../controllers/hotels');

const reservationRouter = require('./reservations');
const promotionRouter = require('./promotions');
const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

router.use('/:hotelId/reservations', reservationRouter);
router.use('/:hotelId/promotions', promotionRouter);

router.route('/').get(getHotels).post(protect, authorize('admin'),createHotel);
router.route('/:id').get(getHotel).put(protect, authorize('admin'), updateHotel).delete(protect, authorize('admin'), deleteHotel);

module.exports=router;