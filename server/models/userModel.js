const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'agent', 'admin'],
      default: 'user',
    },
  },
  {
    // This adds `createdAt` and `updatedAt` fields automatically
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;