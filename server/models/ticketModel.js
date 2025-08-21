const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['billing', 'tech', 'shipping', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['open', 'triaged', 'waiting_human', 'resolved', 'closed'],
      default: 'open',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    agentSuggestionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AgentSuggestion' },
  },
  { timestamps: true }
);

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;