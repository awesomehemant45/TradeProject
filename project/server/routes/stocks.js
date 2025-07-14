import express from 'express';
import Stock from '../models/Stock.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all stocks
router.get('/', async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ symbol: 1 });
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get stock by symbol
router.get('/:symbol', async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get stock price history (mock data)
router.get('/:symbol/history', async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const history = [];
    const now = Date.now();
    const basePrice = stock.price;

    for (let i = 23; i >= 0; i--) {
      const time = now - i * 60 * 60 * 1000;
      const variance = (Math.random() - 0.5) * (basePrice * 0.1);
      history.push({
        time,
        price: Math.max(0.01, basePrice + variance),
        volume: Math.floor(Math.random() * 1000000)
      });
    }

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
