const Booking = require('../models/Booking');
const Service = require('../models/Service');

// POST /api/bookings  (student only)
const createBooking = async (req, res) => {
  try {
    const { serviceId, date, durationHours, notes } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const booking = await Booking.create({
      student: req.user._id,
      tutor: service.tutor,
      service: service._id,
      date,
      durationHours,
      notes,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create booking', error: err.message });
  }
};

// GET /api/bookings/mine  (works for both students and tutors - shows their side of bookings)
const getMyBookings = async (req, res) => {
  try {
    const filter = req.user.role === 'tutor' ? { tutor: req.user._id } : { student: req.user._id };
    const bookings = await Booking.find(filter)
      .populate('service', 'title subject pricePerHour')
      .populate('student', 'name email')
      .populate('tutor', 'name email')
      .sort({ date: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
};

// PUT /api/bookings/:id/status  (tutor confirms/completes, either side can cancel)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'confirmed' | 'completed' | 'cancelled'
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const isOwner =
      booking.student.toString() === req.user._id.toString() ||
      booking.tutor.toString() === req.user._id.toString();
    if (!isOwner) return res.status(403).json({ message: 'Not your booking' });

    // Only the tutor can confirm or mark complete; either side can cancel
    if (['confirmed', 'completed'].includes(status) && req.user.role !== 'tutor') {
      return res.status(403).json({ message: 'Only the tutor can confirm or complete a booking' });
    }

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update booking', error: err.message });
  }
};

module.exports = { createBooking, getMyBookings, updateBookingStatus };
