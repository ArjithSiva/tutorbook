const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getMyServices,
} = require('../controllers/serviceController');
const { protect, restrictTo } = require('../middleware/auth');

// Note: /mine must come before /:id so Express doesn't treat "mine" as an id
router.get('/mine', protect, restrictTo('tutor'), getMyServices);

router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/', protect, restrictTo('tutor'), createService);
router.put('/:id', protect, restrictTo('tutor'), updateService);
router.delete('/:id', protect, restrictTo('tutor'), deleteService);

module.exports = router;
