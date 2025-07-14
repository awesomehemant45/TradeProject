import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { MarketData, Position } from '../types';
import MarketOverview from './MarketOverview';
import PriceChart from './PriceChart';

interface DashboardProps {
  marketData: MarketData[];
  portfolio: Position[];
  balance: number;
}

const Dashboard: React.FC<DashboardProps> = ({ marketData, portfolio, balance }) => {
  const portfolioValue = portfolio.reduce((total, position) => {
    const currentPrice = marketData.find(m => m.symbol === position.symbol)?.price || 0;
    return total + (position.quantity * currentPrice);
  }, 0);

  const totalValue = balance + portfolioValue;
  const totalGainLoss = portfolioValue - portfolio.reduce((total, position) => {
    return total + (position.quantity * position.avgPrice);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Balance</p>
              <p className="text-2xl font-bold text-white">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <DollarSign className="h-12 w-12 text-emerald-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Cash Balance</p>
              <p className="text-2xl font-bold text-white">
                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <DollarSign className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Portfolio Value</p>
              <p className="text-2xl font-bold text-white">
                ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <BarChart3 className="h-12 w-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">P&L</p>
              <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                ${totalGainLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            {totalGainLoss >= 0 ? (
              <TrendingUp className="h-12 w-12 text-emerald-500" />
            ) : (
              <TrendingDown className="h-12 w-12 text-red-500" />
            )}
          </div>
        </div>
      </div>

      {/* Chart and Market Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PriceChart data={marketData[0]} />
        </div>
        <div>
          <MarketOverview marketData={marketData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;