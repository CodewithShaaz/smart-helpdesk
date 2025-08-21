const Ticket = require('../models/ticketModel');
const Article = require('../models/articleModel');
const AgentSuggestion = require('../models/agentSuggestionModel');
const AuditLog = require('../models/auditLogModel');
const { v4: uuidv4 } = require('uuid'); // We need to install this package

// --- Deterministic Stub Functions ---

/**
 * Classifies a ticket based on keywords.
 * @param {object} ticket - The ticket object.
 * @returns {object} - { predictedCategory, confidence }
 */
const classify = (ticket) => {
  const text = `${ticket.title} ${ticket.description}`.toLowerCase();
  let predictedCategory = 'other';
  let confidence = 0.3; // Base confidence for 'other'

  if (/\b(refund|invoice|charge|payment|bill)\b/.test(text)) {
    predictedCategory = 'billing';
    confidence = 0.85;
  } else if (/\b(error|bug|stack|crash|500|fail)\b/.test(text)) {
    predictedCategory = 'tech';
    confidence = 0.9;
  } else if (/\b(delivery|shipment|package|track)\b/.test(text)) {
    predictedCategory = 'shipping';
    confidence = 0.8;
  }
  return { predictedCategory, confidence };
};

/**
 * Retrieves top 3 KB articles based on keywords.
 * @param {string} category - The predicted category.
 * @returns {Array} - An array of article objects.
 */
const retrieve = async (category) => {
  const articles = await Article.find({
    tags: category,
    status: 'published',
  }).limit(3);
  return articles;
};

/**
 * Drafts a reply using a template and article titles.
 * @param {Array} articles - An array of article objects.
 * @returns {string} - The drafted reply.
 */
const draft = (articles) => {
  if (articles.length === 0) {
    return "Our team is looking into your issue and will get back to you shortly.";
  }
  let reply = "Thank you for reaching out. Based on your query, these articles might help:\n";
  articles.forEach((article, index) => {
    reply += `${index + 1}. ${article.title}\n`;
  });
  reply += "\nIf these don't solve your problem, an agent will be with you soon.";
  return reply;
};

// --- Main Triage Orchestrator ---

/**
 * Main triage workflow function.
 * @param {string} ticketId - The ID of the ticket to triage.
 */
const triageTicket = async (ticketId) => {
  const traceId = uuidv4();
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return;

  await AuditLog.create({ ticketId, traceId, actor: 'system', action: 'TRIAGE_STARTED' });

  // 1. Classify
  const { predictedCategory, confidence } = classify(ticket);
  ticket.category = predictedCategory;
  await AuditLog.create({ ticketId, traceId, actor: 'system', action: 'AGENT_CLASSIFIED', meta: { category: predictedCategory, confidence } });

  // 2. Retrieve KB
  const articles = await retrieve(predictedCategory);
  const articleIds = articles.map(a => a._id);
  await AuditLog.create({ ticketId, traceId, actor: 'system', action: 'KB_RETRIEVED', meta: { articleIds } });

  // 3. Draft Reply
  const draftReply = draft(articles);
  await AuditLog.create({ ticketId, traceId, actor: 'system', action: 'DRAFT_GENERATED', meta: { draft: draftReply.substring(0, 100) + '...' } });

  const agentSuggestion = await AgentSuggestion.create({
      ticketId,
      predictedCategory,
      articleIds,
      draftReply,
      confidence,
      modelInfo: { provider: 'stub', model: 'keyword-rules', promptVersion: '1.0' }
  });

  ticket.agentSuggestionId = agentSuggestion._id;

  // 4. Decision
  const autoCloseEnabled = process.env.AUTO_CLOSE_ENABLED === 'true';
  const confidenceThreshold = parseFloat(process.env.CONFIDENCE_THRESHOLD);

  if (autoCloseEnabled && confidence >= confidenceThreshold) {
    ticket.status = 'resolved';
    agentSuggestion.autoClosed = true;
    await agentSuggestion.save();
    await AuditLog.create({ ticketId, traceId, actor: 'system', action: 'AUTO_CLOSED' });
  } else {
    ticket.status = 'waiting_human';
    await AuditLog.create({ ticketId, traceId, actor: 'system', action: 'ASSIGNED_TO_HUMAN' });
  }

  await ticket.save();
  await AuditLog.create({ ticketId, traceId, actor: 'system', action: 'TRIAGE_COMPLETED' });
};

module.exports = { triageTicket };