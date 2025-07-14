import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://hemantku2412003:2tONuk9Q0wKfRYUI@cluster0.fyhgfew.mongodb.net/trading-platform')
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    initializeStocks(); // only after connection
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import stockRoutes from './routes/stocks.js';
import portfolioRoutes from './routes/portfolio.js';
import transactionRoutes from './routes/transactions.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);

// Stock Service
import { initializeStocks, updateStockPrices } from './services/stockService.js';
cron.schedule('*/5 * * * * *', updateStockPrices);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
