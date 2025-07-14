import React, { useState } from 'react';
import { MarketData } from '../types';
import OrderForm from './OrderForm';
import MarketDepth from './MarketDepth';

interface TradingProps {
  marketData: MarketData[];
  onTrade: (symbol: string, type: 'buy' | 'sell', quantity: number, price: number) => void;
}

const Trading: React.FC<TradingProps> = ({ marketData, onTrade }) => {
  const [selectedSymbol, setSelectedSymbol] = useState(marketData[0]?.symbol || '');

  const selectedMarketData = marketData.find(m => m.symbol === selectedSymbol);

  // Update selected symbol when market data changes
  React.useEffect(() => {
    if (marketData.length > 0 && !selectedSymbol) {
      setSelectedSymbol(marketData[0].symbol);
    }
  }, [marketData, selectedSymbol]);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Select Trading Pair</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {marketData.map((data) => (
            <button
              key={data.symbol}
              onClick={() => setSelectedSymbol(data.symbol)}
              className={`p-4 rounded-lg border transition-colors ${
                selectedSymbol === data.symbol
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <div className="text-left">
                <div className="font-semibold">{data.symbol}</div>
                <div className="text-lg font-bold">
                  ${data.price.toFixed(2)}
                </div>
                <div className={`text-sm ${data.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedMarketData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrderForm
            marketData={selectedMarketData}
            onTrade={onTrade}
          />
          <MarketDepth symbol={selectedSymbol} />
        </div>
      )}
    </div>
  );
};

export default Trading;