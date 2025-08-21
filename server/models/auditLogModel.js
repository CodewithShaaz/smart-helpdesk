const mongoose = require('mongoose');

const auditLogSchema = mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  traceId: { type: String, required: true },
  actor: { type: String, enum: ['system', 'agent', 'user'], required: true },
  action: { type: String, required: true },
  meta: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
module.exports = AuditLog;