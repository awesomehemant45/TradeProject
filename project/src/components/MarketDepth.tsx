import React, { useState, useEffect } from 'react';

interface MarketDepthProps {
  symbol: string;
}

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

const MarketDepth: React.FC<MarketDepthProps> = ({ symbol }) => {
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);

  useEffect(() => {
    // Generate mock order book data
    const generateOrderBook = () => {
      const basePrice = 100 + Math.random() * 900;
      const newBids: OrderBookEntry[] = [];
      const newAsks: OrderBookEntry[] = [];

      // Generate bids (buyers)
      for (let i = 0; i < 5; i++) {
        const price = basePrice - (i + 1) * 0.1;
        const size = Math.random() * 100 + 10;
        const total = i === 0 ? size : newBids[i - 1].total + size;
        newBids.push({ price, size, total });
      }

      // Generate asks (sellers)
      for (let i = 0; i < 5; i++) {
        const price = basePrice + (i + 1) * 0.1;
        const size = Math.random() * 100 + 10;
        const total = i === 0 ? size : newAsks[i - 1].total + size;
        newAsks.push({ price, size, total });
      }

      setBids(newBids);
      setAsks(newAsks.reverse()); // Reverse asks to show highest price first
    };

    generateOrderBook();
    const interval = setInterval(generateOrderBook, 2000);

    return () => clearInterval(interval);
  }, [symbol]);

  const maxTotal = Math.max(
    ...bids.map(b => b.total),
    ...asks.map(a => a.total)
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Market Depth - {symbol}</h3>
      
      <div className="space-y-4">
        {/* Asks (Sellers) */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">Asks (Sellers)</h4>
          <div className="space-y-1">
            {asks.map((ask, index) => (
              <div key={index} className="relative flex justify-between text-sm">
                <div
                  className="absolute inset-0 bg-red-500/20 rounded"
                  style={{ width: `${(ask.total / maxTotal) * 100}%` }}
                />
                <span className="relative z-10 text-red-400">${ask.price.toFixed(2)}</span>
                <span className="relative z-10">{ask.size.toFixed(2)}</span>
                <span className="relative z-10 text-gray-400">{ask.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spread */}
        <div className="border-t border-gray-600 pt-2 text-center">
          <span className="text-xs text-gray-400">
            Spread: ${(asks[asks.length - 1]?.price - bids[0]?.price || 0).toFixed(2)}
          </span>
        </div>

        {/* Bids (Buyers) */}
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">Bids (Buyers)</h4>
          <div className="space-y-1">
            {bids.map((bid, index) => (
              <div key={index} className="relative flex justify-between text-sm">
                <div
                  className="absolute inset-0 bg-emerald-500/20 rounded"
                  style={{ width: `${(bid.total / maxTotal) * 100}%` }}
                />
                <span className="relative z-10 text-emerald-400">${bid.price.toFixed(2)}</span>
                <span className="relative z-10">{bid.size.toFixed(2)}</span>
                <span className="relative z-10 text-gray-400">{bid.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>Price</span>
          <span>Size</span>
          <span>Total</span>
        </div>
      </div>
    </div>
  );
};

export default MarketDepth;