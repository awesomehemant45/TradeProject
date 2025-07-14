import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MarketData } from '../types';

interface MarketOverviewProps {
  marketData: MarketData[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ marketData }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Market Overview</h3>
      <div className="space-y-3">
        {marketData.slice(0, 8).map((data) => (
          <div key={data.symbol} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">{data.symbol.slice(0, 2)}</span>
              </div>
              <div>
                <div className="font-medium">{data.symbol}</div>
                <div className="text-sm text-gray-400">
                  Vol: {(data.volume / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">${data.price.toFixed(2)}</div>
              <div className={`flex items-center text-sm ${
                data.change >= 0 ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {data.change >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {data.changePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOverview;