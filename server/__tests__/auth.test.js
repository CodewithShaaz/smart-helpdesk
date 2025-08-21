const request = require('supertest');
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const userRoutes = require('../routes/userRoutes');

// Set up the express app and middleware
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

let mongoServer;

// This function runs once before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  // Mock the environment variables
  process.env.JWT_SECRET = 'test-secret';
});

// This function runs once after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Describe block groups related tests
describe('Authentication API', () => {
  
  // 'it' block defines an individual test case
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
      
    // Assertions: check if the result is what we expect
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe('test@example.com');
  });

  it('should not register a user with an existing email', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Another User',
        email: 'test@example.com', // Using the same email as the previous test
        password: 'password123',
      });
      
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('User already exists');
  });

  it('should log in an existing user successfully', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not log in a user with an incorrect password', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
      
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Invalid email or password');
  });
});