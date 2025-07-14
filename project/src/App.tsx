import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Wallet, History, Settings, User } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/Auth/AuthPage';
import Dashboard from './components/Dashboard';
import Trading from './components/Trading';
import Portfolio from './components/Portfolio';
import TransactionHistory from './components/TransactionHistory';
import { stockAPI, portfolioAPI, transactionAPI } from './services/api';
import { MarketData, Position, Transaction } from './types';

const TradingApp: React.FC = () => {
  const { user, logout, updateBalance } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [portfolio, setPortfolio] = useState<Position[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stocksRes, portfolioRes, transactionsRes] = await Promise.all([
          stockAPI.getAll(),
          portfolioAPI.get(),
          transactionAPI.getAll()
        ]);

        setMarketData(stocksRes.data);
        setPortfolio(portfolioRes.data);
        setTransactions(transactionsRes.data.transactions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Real-time market data updates
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      stockAPI.getAll().then(response => {
        setMarketData(response.data);
      }).catch(console.error);
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const executeTrade = (symbol: string, type: 'buy' | 'sell', quantity: number, price: number) => {
    transactionAPI.executeTrade({
      symbol,
      type,
      quantity,
      orderType: 'market'
    }).then(response => {
      // Update local state
      updateBalance(response.data.newBalance);
      
      // Refresh portfolio and transactions
      Promise.all([
        portfolioAPI.get(),
        transactionAPI.getAll()
      ]).then(([portfolioRes, transactionsRes]) => {
        setPortfolio(portfolioRes.data);
        setTransactions(transactionsRes.data.transactions);
      });
      
      alert(`${type.toUpperCase()} order executed successfully!`);
    }).catch(error => {
      const message = error.response?.data?.message || 'Trade execution failed';
      alert(message);
    });
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-emerald-500" />
            <h1 className="text-2xl font-bold">TradePro</h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-sm">
              <span className="text-gray-400">Welcome, {user?.username}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Balance:</span>
              <span className="ml-2 font-semibold text-emerald-500">
                ${user?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <User className="h-8 w-8" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6">
        <div className="flex space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'trading', label: 'Trading', icon: TrendingUp },
            { id: 'portfolio', label: 'Portfolio', icon: Wallet },
            { id: 'history', label: 'History', icon: History },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-emerald-500 text-emerald-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'dashboard' && (
          <Dashboard marketData={marketData} portfolio={portfolio} balance={user?.balance || 0} />
        )}
        {activeTab === 'trading' && (
          <Trading marketData={marketData} onTrade={executeTrade} />
        )}
        {activeTab === 'portfolio' && (
          <Portfolio portfolio={portfolio} marketData={marketData} />
        )}
        {activeTab === 'history' && (
          <TransactionHistory transactions={transactions} />
        )}
      </main>
    </div>
  );
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <TradingApp />;
}

const AppWithAuth: React.FC = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default AppWithAuth;