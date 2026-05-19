// src/components/portfolio/PortfolioView.jsx
import React, { useState } from 'react';
import { 
  PieChart, TrendingUp, TrendingDown, Wallet, Bitcoin, 
  Clock, ArrowUpRight, ArrowDownRight, Activity,
  Lock, Calendar, DollarSign, Percent, BarChart3,
  ChevronRight, Eye, EyeOff, PlusCircle, Send
} from 'lucide-react';
import { fmtUSD, fmt } from '../../Utils/formatters';

// Component for Crypto Holdings
const CryptoHoldings = ({ positions, prices, onSelectCoin }) => {
  const [showZeroBalances, setShowZeroBalances] = useState(false);
  
  const holdingsWithValues = positions?.map(pos => {
    const currentPrice = prices?.[pos.symbol]?.price || 0;
    const currentValue = currentPrice * pos.quantity;
    const pnl = currentValue - (pos.avg_buy_price * pos.quantity);
    const pnlPct = (pnl / (pos.avg_buy_price * pos.quantity)) * 100;
    
    return {
      ...pos,
      currentPrice,
      currentValue,
      pnl,
      pnlPct
    };
  }).filter(h => showZeroBalances || h.currentValue > 0.01);

  const totalCryptoValue = holdingsWithValues.reduce((sum, h) => sum + h.currentValue, 0);

  if (!positions || positions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl">
        <Bitcoin size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">No crypto holdings yet</p>
        <p className="text-sm text-gray-400 mt-1">Start trading to build your portfolio</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Crypto Holdings</h3>
          <p className="text-sm text-gray-500">Total Value: {fmtUSD(totalCryptoValue)}</p>
        </div>
        <button
          onClick={() => setShowZeroBalances(!showZeroBalances)}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          {showZeroBalances ? <EyeOff size={14} /> : <Eye size={14} />}
          {showZeroBalances ? "Hide zero" : "Show all"}
        </button>
      </div>

      <div className="space-y-3">
        {holdingsWithValues.map((holding) => {
          const isUp = holding.pnl >= 0;
          
          return (
            <div
              key={holding.symbol}
              onClick={() => onSelectCoin?.(holding.symbol)}
              className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">{holding.symbol}</span>
                    <span className="text-xs text-gray-500">{holding.quantity.toFixed(8)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Avg: {fmtUSD(holding.avg_buy_price)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{fmtUSD(holding.currentValue)}</p>
                  <p className={`text-xs font-semibold flex items-center justify-end gap-1 mt-1 ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                    {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {fmtUSD(Math.abs(holding.pnl))} ({fmt(Math.abs(holding.pnlPct))}%)
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Current: {fmtUSD(holding.currentPrice)}</span>
                <span>24h: {prices?.[holding.symbol]?.change24h?.toFixed(2) || 0}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Component for Active Investments
const ActiveInvestments = ({ investments = [], onViewDetails }) => {
  const [expandedId, setExpandedId] = useState(null);

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + (inv.current_value || inv.amount), 0);
  const totalReturns = totalCurrentValue - totalInvested;

  if (investments.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl">
        <TrendingUp size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">No active investments</p>
        <p className="text-sm text-gray-400 mt-1">Start investing to grow your wealth</p>
      </div>
    );
  }

  return (
    <div>
      {/* Investments Summary */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-4 mb-6 text-white">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs opacity-80 mb-1">Total Invested</p>
            <p className="text-xl font-bold">{fmtUSD(totalInvested)}</p>
          </div>
          <div>
            <p className="text-xs opacity-80 mb-1">Current Value</p>
            <p className="text-xl font-bold">{fmtUSD(totalCurrentValue)}</p>
          </div>
          <div>
            <p className="text-xs opacity-80 mb-1">Total Returns</p>
            <p className={`text-xl font-bold ${totalReturns >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {totalReturns >= 0 ? '+' : ''}{fmtUSD(totalReturns)}
            </p>
          </div>
        </div>
      </div>

      {/* Individual Investments */}
      <div className="space-y-4">
        {investments.map((investment) => {
          const isExpanded = expandedId === investment.id;
          const daysLeft = Math.ceil((new Date(investment.maturity_date) - new Date()) / (1000 * 60 * 60 * 24));
          const progress = investment.progress || Math.min(100, Math.max(0, ((investment.amount - (investment.current_value || investment.amount)) / investment.amount) * 100));
          
          return (
            <div key={investment.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">{investment.plan_name}</h4>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                        {investment.status || 'Active'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Invested {fmtUSD(investment.amount)} on {new Date(investment.invested_at).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : investment.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ChevronRight size={20} className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Expected Return</p>
                    <p className="text-sm font-bold text-purple-600">+{investment.expected_return_percent}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Current Returns</p>
                    <p className="text-sm font-bold text-green-600">+{fmtUSD(investment.returns_earned || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Days Left</p>
                    <p className="text-sm font-bold text-gray-900">{daysLeft > 0 ? daysLeft : 0} days</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Progress to maturity</span>
                    <span className="font-semibold text-gray-900">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Investment Date</p>
                        <p className="font-semibold text-gray-900">{new Date(investment.invested_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Maturity Date</p>
                        <p className="font-semibold text-gray-900">{new Date(investment.maturity_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Term Length</p>
                        <p className="font-semibold text-gray-900">{investment.term_days} days</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Expected Total</p>
                        <p className="font-semibold text-purple-600">
                          {fmtUSD(investment.amount * (1 + investment.expected_return_percent / 100))}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => onViewDetails?.(investment)}
                      className="w-full mt-2 py-2 rounded-lg border-2 border-purple-200 text-purple-600 font-semibold text-sm hover:bg-purple-50 transition-colors"
                    >
                      View Full Details →
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Portfolio View Component
const PortfolioView = ({ 
  positions = [], 
  prices = {}, 
  buyingPower = 0,
  totalValue = 0,
  pnl = 0,
  pnlPct = 0,
  setSelectedCoin,
  setShowCoinDetail,
  setShowDepositSheet,  // Add this prop
  setShowInvestSheet,   // Add this prop
  investments = []       // Add this prop
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const totalCryptoValue = positions.reduce((sum, pos) => {
    const currentPrice = prices[pos.symbol]?.price || 0;
    return sum + (currentPrice * pos.quantity);
  }, 0);

  const stats = [
    { label: "Total Portfolio", value: fmtUSD(totalValue), icon: PieChart, color: "purple", action: null },
    { label: "Crypto Holdings", value: fmtUSD(totalCryptoValue), icon: Bitcoin, color: "orange", action: null },
    { label: "Active Investments", value: fmtUSD(investments.reduce((s, i) => s + (i.current_value || i.amount), 0)), icon: TrendingUp, color: "green", action: null },
    { label: "Buying Power", value: fmtUSD(buyingPower), icon: Wallet, color: "blue", action: null }
  ];

  const quickActions = [
    { 
      label: "Deposit Funds", 
      icon: PlusCircle, 
      color: "teal", 
      bgColor: "bg-teal-50", 
      textColor: "text-teal-600",
      hoverColor: "hover:bg-teal-100",
      action: () => setShowDepositSheet?.(true)
    },
    { 
      label: "Start New Investment", 
      icon: TrendingUp, 
      color: "purple", 
      bgColor: "bg-purple-50", 
      textColor: "text-purple-600",
      hoverColor: "hover:bg-purple-100",
      action: () => setShowInvestSheet?.(true)
    },
    { 
      label: "Withdraw Funds", 
      icon: Send, 
      color: "orange", 
      bgColor: "bg-orange-50", 
      textColor: "text-orange-600",
      hoverColor: "hover:bg-orange-100",
      action: () => setShowDepositSheet?.(false) // This would need a setShowWithdrawSheet
    },
    { 
      label: "View Markets", 
      icon: BarChart3, 
      color: "blue", 
      bgColor: "bg-blue-50", 
      textColor: "text-blue-600",
      hoverColor: "hover:bg-blue-100",
      action: () => {
        // Navigate to markets tab - you can implement this
        console.log("Navigate to markets");
      }
    }
  ];

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio</h1>
        <p className="text-gray-500">Track your crypto holdings and investment performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center`}>
                  <Icon size={20} className={`text-${stat.color}-500`} />
                </div>
                {idx === 0 && (
                  <div className={`flex items-center gap-1 text-sm font-semibold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {pnl >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {fmt(Math.abs(pnlPct))}%
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          {[
            { id: 'overview', label: 'Overview', icon: PieChart },
            { id: 'crypto', label: 'Crypto Holdings', icon: Bitcoin },
            { id: 'investments', label: 'Investments', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  pb-3 px-1 flex items-center gap-2 border-b-2 transition-all
                  ${activeTab === tab.id 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <Icon size={16} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <PieChart size={18} className="text-purple-500" />
                  Asset Allocation
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Crypto Holdings</span>
                      <span className="font-semibold">{totalValue > 0 ? ((totalCryptoValue / totalValue) * 100).toFixed(1) : 0}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-orange-500 rounded-full h-2" style={{ width: `${totalValue > 0 ? (totalCryptoValue / totalValue) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Investments</span>
                      <span className="font-semibold">{totalValue > 0 ? ((investments.reduce((s, i) => s + (i.current_value || i.amount), 0) / totalValue) * 100).toFixed(1) : 0}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-purple-500 rounded-full h-2" style={{ width: `${totalValue > 0 ? (investments.reduce((s, i) => s + (i.current_value || i.amount), 0) / totalValue) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Buying Power</span>
                      <span className="font-semibold">{totalValue > 0 ? ((buyingPower / totalValue) * 100).toFixed(1) : 0}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-blue-500 rounded-full h-2" style={{ width: `${totalValue > 0 ? (buyingPower / totalValue) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-purple-500" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {quickActions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={idx}
                        onClick={action.action}
                        className={`w-full py-3 ${action.bgColor} rounded-xl font-semibold ${action.textColor} ${action.hoverColor} transition-all duration-200 flex items-center justify-center gap-2`}
                      >
                        <Icon size={18} />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3 text-gray-500 text-center py-8">
                <Activity size={32} className="mx-auto text-gray-300" />
                <p>No recent activity to show</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crypto' && (
          <CryptoHoldings 
            positions={positions}
            prices={prices}
            onSelectCoin={(symbol) => {
              const coin = Object.values(prices).find(c => c.symbol === symbol);
              if (coin && setSelectedCoin) {
                setSelectedCoin(coin);
                setShowCoinDetail?.(true);
              }
            }}
          />
        )}

        {activeTab === 'investments' && (
          <ActiveInvestments 
            investments={investments}
            onViewDetails={(investment) => {
              console.log("View details for:", investment);
              // You can add a modal or navigate to investment details page
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PortfolioView;