const mongoose = require('mongoose');

const configSchema = mongoose.Schema({
  autoCloseEnabled: { type: Boolean, default: true },
  confidenceThreshold: { type: Number, default: 0.75 },
  slaHours: { type: Number, default: 24 },
});

const Config = mongoose.model('Config', configSchema);
module.exports = Config;