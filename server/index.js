const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Added cors import
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const kbRoutes = require('./routes/kbRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

dotenv.config();
connectDB();

const app = express();

// Allow both local development and production Netlify site
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://smart-helpdeskagent.netlify.app'
  ]
}));

app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => {
  res.send('Smart Helpdesk API is running!');
});

// Use the user routes
app.use('/api/users', userRoutes);
app.use('/api/kb', kbRoutes);
app.use('/api/tickets', ticketRoutes);

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});