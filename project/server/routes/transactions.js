import express from 'express';
import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import Portfolio from '../models/Portfolio.js';
import User from '../models/User.js';
import Stock from '../models/Stock.js';
import auth from '../middleware/auth.js';

const router = express.Router();
// Get user transactions
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const transactions = await Transaction.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments({ userId: req.userId });

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Execute trade (buy/sell)
router.post('/trade', auth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { symbol, type, quantity, orderType = 'market', limitPrice } = req.body;

    // Validate input
    if (!symbol || !type || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid trade parameters' });
    }

    if (!['buy', 'sell'].includes(type)) {
      return res.status(400).json({ message: 'Invalid trade type' });
    }

    // Get current stock price
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() }).session(session);
    if (!stock) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Determine execution price
    let executionPrice;
    if (orderType === 'market') {
      executionPrice = stock.price;
    } else if (orderType === 'limit') {
      if (!limitPrice || limitPrice <= 0) {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Invalid limit price' });
      }
      
      // For demo purposes, execute limit orders immediately if price is favorable
      if (type === 'buy' && limitPrice >= stock.price) {
        executionPrice = stock.price;
      } else if (type === 'sell' && limitPrice <= stock.price) {
        executionPrice = stock.price;
      } else {
        await session.abortTransaction();
        return res.status(400).json({ 
          message: 'Limit order cannot be executed at current market price' 
        });
      }
    }

    const total = quantity * executionPrice;
    const fee = total * 0.001; // 0.1% trading fee
    const totalWithFee = total + fee;

    // Get user
    const user = await User.findById(req.userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'User not found' });
    }

    if (type === 'buy') {
      // Check if user has sufficient balance
      if (user.balance < totalWithFee) {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      // Deduct balance
      user.balance -= totalWithFee;
      await user.save({ session });

      // Update or create portfolio position
      const existingPosition = await Portfolio.findOne({
        userId: req.userId,
        symbol: symbol.toUpperCase()
      }).session(session);

      if (existingPosition) {
        // Update existing position
        const newTotalQuantity = existingPosition.quantity + quantity;
        const newTotalInvested = existingPosition.totalInvested + total;
        existingPosition.quantity = newTotalQuantity;
        existingPosition.avgPrice = newTotalInvested / newTotalQuantity;
        existingPosition.totalInvested = newTotalInvested;
        existingPosition.updatedAt = new Date();
        await existingPosition.save({ session });
      } else {
        // Create new position
        const newPosition = new Portfolio({
          userId: req.userId,
          symbol: symbol.toUpperCase(),
          quantity,
          avgPrice: executionPrice,
          totalInvested: total
        });
        await newPosition.save({ session });
      }

    } else { // sell
      // Check if user has sufficient shares
      const position = await Portfolio.findOne({
        userId: req.userId,
        symbol: symbol.toUpperCase()
      }).session(session);

      if (!position || position.quantity < quantity) {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Insufficient shares to sell' });
      }

      // Add balance (minus fee)
      user.balance += (total - fee);
      await user.save({ session });

      // Update portfolio position
      const newQuantity = position.quantity - quantity;
      const soldInvestment = (quantity / position.quantity) * position.totalInvested;
      
      if (newQuantity <= 0) {
        // Remove position if all shares sold
        await Portfolio.deleteOne({ _id: position._id }).session(session);
      } else {
        // Update position
        position.quantity = newQuantity;
        position.totalInvested -= soldInvestment;
        position.updatedAt = new Date();
        await position.save({ session });
      }
    }

    // Create transaction record
    const transaction = new Transaction({
      userId: req.userId,
      symbol: symbol.toUpperCase(),
      type,
      quantity,
      price: executionPrice,
      total: totalWithFee,
      fee,
      status: 'completed'
    });
    await transaction.save({ session });

    await session.commitTransaction();

    res.json({
      message: 'Trade executed successfully',
      transaction: transaction.toObject(),
      newBalance: user.balance
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    session.endSession();
  }
});


export default router;
