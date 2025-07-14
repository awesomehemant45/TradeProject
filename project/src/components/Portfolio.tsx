import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Position, MarketData } from '../types';

interface PortfolioProps {
  portfolio: Position[];
  marketData: MarketData[];
}

const Portfolio: React.FC<PortfolioProps> = ({ portfolio, marketData }) => {
  const getPositionData = (position: Position) => {
    const currentPrice = marketData.find(m => m.symbol === position.symbol)?.price || 0;
    const currentValue = position.quantity * currentPrice;
    const costBasis = position.quantity * position.avgPrice;
    const unrealizedPnL = currentValue - costBasis;
    const unrealizedPnLPercent = (unrealizedPnL / costBasis) * 100;

    return {
      currentPrice,
      currentValue,
      costBasis,
      unrealizedPnL,
      unrealizedPnLPercent
    };
  };

  const totalPortfolioValue = portfolio.reduce((total, position) => {
    const { currentValue } = getPositionData(position);
    return total + currentValue;
  }, 0);

  const totalCostBasis = portfolio.reduce((total, position) => {
    return total + (position.quantity * position.avgPrice);
  }, 0);

  const totalUnrealizedPnL = totalPortfolioValue - totalCostBasis;

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Portfolio Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Total Value</p>
            <p className="text-2xl font-bold">
              ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Cost Basis</p>
            <p className="text-2xl font-bold">
              ${totalCostBasis.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Unrealized P&L</p>
            <p className={`text-2xl font-bold flex items-center ${
              totalUnrealizedPnL >= 0 ? 'text-emerald-500' : 'text-red-500'
            }`}>
              {totalUnrealizedPnL >= 0 ? (
                <TrendingUp className="h-6 w-6 mr-2" />
              ) : (
                <TrendingDown className="h-6 w-6 mr-2" />
              )}
              ${Math.abs(totalUnrealizedPnL).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold">Holdings</h2>
        </div>
        
        {portfolio.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No positions found. Start trading to build your portfolio.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Avg Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Market Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Unrealized P&L
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {portfolio.map((position) => {
                  const { currentPrice, currentValue, unrealizedPnL, unrealizedPnLPercent } = getPositionData(position);
                  
                  return (
                    <tr key={position.symbol} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{position.symbol}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {position.quantity.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${position.avgPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${currentPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${currentValue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center ${
                          unrealizedPnL >= 0 ? 'text-emerald-500' : 'text-red-500'
                        }`}>
                          {unrealizedPnL >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          <div>
                            ${Math.abs(unrealizedPnL).toFixed(2)}
                            <div className="text-xs">
                              ({unrealizedPnLPercent >= 0 ? '+' : ''}{unrealizedPnLPercent.toFixed(2)}%)
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;