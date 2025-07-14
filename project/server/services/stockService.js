import Stock from '../models/Stock.js';

const initialStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2750.80, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 415.25, sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3380.00, sector: 'Consumer Discretionary' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 850.75, sector: 'Automotive' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.30, sector: 'Technology' },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 485.60, sector: 'Technology' },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 425.90, sector: 'Entertainment' },
  { symbol: 'BTC', name: 'Bitcoin', price: 65000.00, sector: 'Cryptocurrency' },
  { symbol: 'ETH', name: 'Ethereum', price: 3200.00, sector: 'Cryptocurrency' }
];

export const initializeStocks = async () => {
  try {
    const existingStocks = await Stock.countDocuments();

    if (existingStocks === 0) {
      console.log('Initializing stock data...');

      const stocksWithDefaults = initialStocks.map(stock => ({
        ...stock,
        previousPrice: stock.price,
        change: 0,
        changePercent: 0,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        marketCap: stock.price * (Math.floor(Math.random() * 1000000000) + 100000000)
      }));

      await Stock.insertMany(stocksWithDefaults);
      console.log('Stock data initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing stocks:', error);
  }
};

export const updateStockPrices = async () => {
  try {
    const stocks = await Stock.find();

    const updates = stocks.map(stock => {
      const volatility = 0.02;
      const randomChange = (Math.random() - 0.5) * 2 * volatility;
      const newPrice = Math.max(0.01, stock.price * (1 + randomChange));
      const change = newPrice - stock.previousPrice;
      const changePercent = stock.previousPrice > 0 ? (change / stock.previousPrice) * 100 : 0;

      return {
        updateOne: {
          filter: { _id: stock._id },
          update: {
            previousPrice: stock.price,
            price: newPrice,
            change,
            changePercent,
            volume: stock.volume + Math.floor(Math.random() * 100000),
            lastUpdated: new Date()
          }
        }
      };
    });

    if (updates.length > 0) {
      await Stock.bulkWrite(updates);
    }
  } catch (error) {
    console.error('Error updating stock prices:', error);
  }
};
