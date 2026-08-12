const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middleware/auth');

router.post('/', protect, restrictTo('student'), createBooking);
router.get('/mine', protect, getMyBookings);
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;
