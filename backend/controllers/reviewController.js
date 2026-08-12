const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

// POST /api/reviews  (student only, must be for a completed booking they made)
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only review your own bookings' });
    }
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review completed lessons' });
    }

    const review = await Review.create({
      booking: booking._id,
      student: req.user._id,
      tutor: booking.tutor,
      service: booking.service,
      rating,
      comment,
    });

    // Recalculate the service's average rating
    const allReviews = await Review.find({ service: booking.service });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Service.findByIdAndUpdate(booking.service, {
      averageRating: avg,
      reviewCount: allReviews.length,
    });

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You already reviewed this booking' });
    }
    res.status(500).json({ message: 'Failed to create review', error: err.message });
  }
};

// GET /api/reviews/service/:serviceId  (public)
const getServiceReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate('student', 'name avatarUrl')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};

module.exports = { createReview, getServiceReviews };
