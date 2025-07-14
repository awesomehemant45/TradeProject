import express from 'express';
import Portfolio from '../models/Portfolio.js';
import Stock from '../models/Stock.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user portfolio
router.get('/', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ userId: req.userId });
    
    // Enrich portfolio with current stock prices
    const enrichedPortfolio = await Promise.all(
      portfolio.map(async (position) => {
        const stock = await Stock.findOne({ symbol: position.symbol });
        const currentPrice = stock ? stock.price : 0;
        const currentValue = position.quantity * currentPrice;
        const unrealizedPnL = currentValue - position.totalInvested;
        const unrealizedPnLPercent = position.totalInvested > 0 
          ? (unrealizedPnL / position.totalInvested) * 100 
          : 0;

        return {
          ...position.toObject(),
          currentPrice,
          currentValue,
          unrealizedPnL,
          unrealizedPnLPercent,
          stockName: stock ? stock.name : position.symbol
        };
      })
    );

    res.json(enrichedPortfolio);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get portfolio summary
router.get('/summary', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ userId: req.userId });
    
    let totalValue = 0;
    let totalInvested = 0;

    for (const position of portfolio) {
      const stock = await Stock.findOne({ symbol: position.symbol });
      const currentPrice = stock ? stock.price : 0;
      totalValue += position.quantity * currentPrice;
      totalInvested += position.totalInvested;
    }

    const totalPnL = totalValue - totalInvested;
    const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    res.json({
      totalValue,
      totalInvested,
      totalPnL,
      totalPnLPercent,
      positionsCount: portfolio.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;