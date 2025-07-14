import React, { useEffect, useState } from 'react';
import { MarketData } from '../types';

interface PriceChartProps {
  data: MarketData;
}

interface ChartPoint {
  time: number;
  price: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    if (!data) return;

    // Generate initial chart data
    const now = Date.now();
    const points: ChartPoint[] = [];
    
    for (let i = 23; i >= 0; i--) {
      const time = now - (i * 60 * 60 * 1000); // Hourly data
      const variance = (Math.random() - 0.5) * 20;
      points.push({
        time,
        price: data.price + variance
      });
    }
    
    setChartData(points);
  }, [data]);

  useEffect(() => {
    if (!data) return;

    // Update chart with new price
    const interval = setInterval(() => {
      setChartData(prev => {
        const newPoint = {
          time: Date.now(),
          price: data.price
        };
        return [...prev.slice(-23), newPoint];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [data?.price]);

  if (!data || chartData.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const maxPrice = Math.max(...chartData.map(p => p.price));
  const minPrice = Math.min(...chartData.map(p => p.price));
  const priceRange = maxPrice - minPrice;

  const pathData = chartData.map((point, index) => {
    const x = (index / (chartData.length - 1)) * 100;
    const y = 100 - ((point.price - minPrice) / priceRange) * 100;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{data.symbol} Price Chart</h3>
          <p className="text-2xl font-bold">${data.price.toFixed(2)}</p>
          <p className={`text-sm ${data.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
          </p>
        </div>
      </div>
      
      <div className="relative h-64">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: data.change >= 0 ? '#10b981' : '#ef4444', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: data.change >= 0 ? '#10b981' : '#ef4444', stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          
          <path
            d={`${pathData} L 100 100 L 0 100 Z`}
            fill="url(#priceGradient)"
          />
          
          <path
            d={pathData}
            fill="none"
            stroke={data.change >= 0 ? '#10b981' : '#ef4444'}
            strokeWidth="0.5"
          />
        </svg>
        
        {/* Price labels */}
        <div className="absolute left-0 top-0 text-xs text-gray-400">
          ${maxPrice.toFixed(2)}
        </div>
        <div className="absolute left-0 bottom-0 text-xs text-gray-400">
          ${minPrice.toFixed(2)}
        </div>
      </div>
      
      <div className="mt-4 flex justify-between text-xs text-gray-400">
        <span>24h ago</span>
        <span>Now</span>
      </div>
    </div>
  );
};

export default PriceChart;