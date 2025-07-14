import React, { useState } from 'react';
import { MarketData } from '../types';

interface OrderFormProps {
  marketData: MarketData;
  onTrade: (symbol: string, type: 'buy' | 'sell', quantity: number, price: number) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ marketData, onTrade }) => {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [priceType, setPriceType] = useState<'market' | 'limit'>('market');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState(marketData.price.toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const qty = parseFloat(quantity);
    const orderPrice = priceType === 'market' ? marketData.price : parseFloat(price);
    
    if (qty <= 0 || orderPrice <= 0) {
      alert('Please enter valid quantity and price');
      return;
    }
    
    onTrade(marketData.symbol, orderType, qty, orderPrice);
    setQuantity('');
  };

  const total = parseFloat(quantity) * (priceType === 'market' ? marketData.price : parseFloat(price)) || 0;

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Place Order - {marketData.symbol}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order Type */}
        <div className="flex rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setOrderType('buy')}
            className={`flex-1 py-2 px-4 font-medium ${
              orderType === 'buy'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setOrderType('sell')}
            className={`flex-1 py-2 px-4 font-medium ${
              orderType === 'sell'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Sell
          </button>
        </div>

        {/* Price Type */}
        <div className="flex rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setPriceType('market')}
            className={`flex-1 py-2 px-4 font-medium ${
              priceType === 'market'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Market
          </button>
          <button
            type="button"
            onClick={() => setPriceType('limit')}
            className={`flex-1 py-2 px-4 font-medium ${
              priceType === 'limit'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Limit
          </button>
        </div>

        {/* Current Price */}
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="flex justify-between">
            <span className="text-gray-400">Current Price:</span>
            <span className="font-semibold">${marketData.price.toFixed(2)}</span>
          </div>
        </div>

        {/* Price Input (for limit orders) */}
        {priceType === 'limit' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Limit Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter limit price"
            />
          </div>
        )}

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            step="0.0001"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter quantity"
            required
          />
        </div>

        {/* Total */}
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="flex justify-between">
            <span className="text-gray-400">Total:</span>
            <span className="font-semibold">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            orderType === 'buy'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {orderType === 'buy' ? 'Buy' : 'Sell'} {marketData.symbol}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;