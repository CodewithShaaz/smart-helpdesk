const mongoose = require('mongoose');

const agentSuggestionSchema = mongoose.Schema(
  {
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
    predictedCategory: { type: String, required: true },
    articleIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
    draftReply: { type: String, required: true },
    confidence: { type: Number, required: true },
    autoClosed: { type: Boolean, default: false },
    modelInfo: {
      provider: String,
      model: String,
      promptVersion: String,
      latencyMs: Number,
    },
  },
  { timestamps: true }
);

const AgentSuggestion = mongoose.model('AgentSuggestion', agentSuggestionSchema);
module.exports = AgentSuggestion;