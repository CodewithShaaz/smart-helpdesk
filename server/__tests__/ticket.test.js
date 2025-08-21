const request = require('supertest');
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const userRoutes = require('../routes/userRoutes');
const ticketRoutes = require('../routes/ticketRoutes');
const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');

// Set up the express app
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);

let mongoServer;
let authToken;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Mock environment variables
  process.env.JWT_SECRET = 'test-secret';
  process.env.AUTO_CLOSE_ENABLED = 'true';
  process.env.CONFIDENCE_THRESHOLD = '0.8';

  // Create and login a user to get a token for protected routes
  await request(app).post('/api/users/register').send({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  });

  const loginRes = await request(app).post('/api/users/login').send({
    email: 'test@example.com',
    password: 'password123',
  });

  authToken = loginRes.body.token;
  userId = loginRes.body._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Ticket and Agent API', () => {

  it('should allow a logged-in user to create a ticket', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${authToken}`) // Use the token
      .send({
        title: 'My invoice is wrong',
        description: 'I need a refund for a double charge.',
      });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toBe('My invoice is wrong');
    expect(res.body.createdBy).toBe(userId);
  });

  it('should trigger the agent to triage and auto-resolve a new ticket', async () => {
    const ticketData = {
      title: 'Billing issue with payment',
      description: 'My invoice has an error, please refund.',
    };

    const createTicketRes = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${authToken}`)
      .send(ticketData);

    const ticketId = createTicketRes.body._id;

    // Wait for the agent's background process to finish
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check the database to see the agent's work
    const updatedTicket = await Ticket.findById(ticketId);
    
    expect(updatedTicket.category).toBe('billing');
    expect(updatedTicket.status).toBe('resolved');
  });
});