import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true,
    match: /^\d{8}$/, // Enforces exactly 8 digits
  },
  date: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Result', resultSchema);
