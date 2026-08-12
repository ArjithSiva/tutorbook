const express = require('express');
const router = express.Router();
const { createReview, getServiceReviews } = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middleware/auth');

router.post('/', protect, restrictTo('student'), createReview);
router.get('/service/:serviceId', getServiceReviews);

module.exports = router;
