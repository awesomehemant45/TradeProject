import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-2 mb-8">
            <TrendingUp className="h-12 w-12 text-emerald-500" />
            <h1 className="text-4xl font-bold text-white">TradePro</h1>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Professional Trading Platform
          </h2>
          
          <p className="text-xl text-gray-300 mb-8">
            Trade stocks, cryptocurrencies, and more with real-time market data, 
            advanced charting tools, and professional-grade portfolio management.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="font-semibold text-emerald-500 mb-2">Real-time Data</h3>
              <p className="text-sm text-gray-400">
                Live market prices and instant trade execution
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="font-semibold text-emerald-500 mb-2">Portfolio Tracking</h3>
              <p className="text-sm text-gray-400">
                Advanced analytics and performance metrics
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="font-semibold text-emerald-500 mb-2">Secure Trading</h3>
              <p className="text-sm text-gray-400">
                Bank-level security and encrypted transactions
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="font-semibold text-emerald-500 mb-2">Mobile Ready</h3>
              <p className="text-sm text-gray-400">
                Trade anywhere with our responsive platform
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div>
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;