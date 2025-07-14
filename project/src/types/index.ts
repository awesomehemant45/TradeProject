export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface Position {
  symbol: string;
  quantity: number;
  avgPrice: number;
}

export interface Transaction {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'cancelled';
}