const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('password123', salt),
    role: 'admin',
  },
  {
    name: 'Agent User',
    email: 'agent@example.com',
    password: bcrypt.hashSync('password123', salt),
    role: 'agent',
  },
  {
    name: 'Normal User',
    email: 'user@example.com',
    password: bcrypt.hashSync('password123', salt),
    role: 'user',
  },
];

module.exports = users;