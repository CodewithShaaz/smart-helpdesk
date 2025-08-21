const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicketById,
} = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createTicket).get(protect, getTickets);
router.route('/:id').get(protect, getTicketById);

module.exports = router;