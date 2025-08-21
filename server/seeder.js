const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users.js');
const articles = require('./data/articles.js');
const User = require('./models/userModel.js');
const Article = require('./models/articleModel.js');
const Ticket = require('./models/ticketModel.js');
const AgentSuggestion = require('./models/agentSuggestionModel.js');
const AuditLog = require('./models/auditLogModel.js');
const connectDB = require('./config/db.js');

// This is the only line that needs to change
dotenv.config({ path: '.env.local' });

const importData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Article.deleteMany();
    await Ticket.deleteMany();
    await AgentSuggestion.deleteMany();
    await AuditLog.deleteMany();
    await User.insertMany(users);
    await Article.insertMany(articles);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Article.deleteMany();
    await Ticket.deleteMany();
    await AgentSuggestion.deleteMany();
    await AuditLog.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}