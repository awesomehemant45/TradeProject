import mongoose from 'mongoose';
const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  avgPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalInvested: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

portfolioSchema.index({ userId: 1, symbol: 1 }, { unique: true });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;