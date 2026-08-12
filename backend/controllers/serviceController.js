const Service = require('../models/Service');

// GET /api/services  (public - browse/search all listings)
// Supports optional query params: ?subject=Math&minPrice=10&maxPrice=50
const getServices = async (req, res) => {
  try {
    const { subject, minPrice, maxPrice } = req.query;
    const filter = { isActive: true };

    if (subject) filter.subject = new RegExp(subject, 'i'); // case-insensitive partial match
    if (minPrice || maxPrice) {
      filter.pricePerHour = {};
      if (minPrice) filter.pricePerHour.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerHour.$lte = Number(maxPrice);
    }

    const services = await Service.find(filter)
      .populate('tutor', 'name avatarUrl bio')
      .sort({ createdAt: -1 });

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services', error: err.message });
  }
};

// GET /api/services/:id  (public - single listing detail)
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('tutor', 'name avatarUrl bio subjects');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch service', error: err.message });
  }
};

// POST /api/services  (tutor only)
const createService = async (req, res) => {
  try {
    const { subject, title, description, pricePerHour, availability } = req.body;
    const service = await Service.create({
      tutor: req.user._id,
      subject,
      title,
      description,
      pricePerHour,
      availability,
    });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create service', error: err.message });
  }
};

// PUT /api/services/:id  (tutor only, must own the listing)
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own listings' });
    }

    Object.assign(service, req.body);
    await service.save();
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update service', error: err.message });
  }
};

// DELETE /api/services/:id  (tutor only, must own the listing)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own listings' });
    }

    await service.deleteOne();
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete service', error: err.message });
  }
};

// GET /api/services/mine  (tutor only - their own listings)
const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ tutor: req.user._id }).sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your services', error: err.message });
  }
};

module.exports = { getServices, getServiceById, createService, updateService, deleteService, getMyServices };
