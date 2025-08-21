const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');
const { triageTicket } = require('./agentController'); // Import the triage function

// @desc    Create a new ticket
// @route   POST /api/tickets
const createTicket = async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description) {
    res.status(400).json({ message: 'Please add a title and description' });
    return;
  }

  const ticket = await Ticket.create({
    title,
    description,
    category,
    createdBy: req.user._id,
  });

  if (ticket) {
    // Trigger the triage process in the background
    setTimeout(() => {
      triageTicket(ticket._id);
    }, 0);

    res.status(201).json(ticket);
  } else {
    res.status(400).json({ message: 'Invalid ticket data' });
  }
};

// @desc    Get user's tickets or all tickets for agents/admins
// @route   GET /api/tickets
const getTickets = async (req, res) => {
  if (req.user.role === 'agent' || req.user.role === 'admin') {
    const tickets = await Ticket.find({}).populate('createdBy', 'name email');
    res.json(tickets);
  } else {
    const tickets = await Ticket.find({ createdBy: req.user._id });
    res.json(tickets);
  }
};

// @desc    Get a single ticket by ID
// @route   GET /api/tickets/:id
const getTicketById = async (req, res) => {
    const ticket = await Ticket.findById(req.params.id)
        .populate('createdBy', 'name email')
        .populate({
            path: 'agentSuggestionId',
            populate: { path: 'articleIds', model: 'Article' }
        });

    if (!ticket) {
        res.status(404).json({ message: 'Ticket not found' });
        return;
    }

    if (ticket.createdBy._id.toString() !== req.user._id.toString() && req.user.role !== 'agent' && req.user.role !== 'admin') {
        res.status(403).json({ message: 'User not authorized' });
        return;
    }

    // Also fetch audit logs for the ticket
    const auditLogs = await AuditLog.find({ ticketId: req.params.id }).sort({ timestamp: 1 });

    res.json({ ticket, auditLogs });
};

// We need to import AuditLog here as well
const AuditLog = require('../models/auditLogModel');

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
};