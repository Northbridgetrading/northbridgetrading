// src/components/portfolio/ActiveInvestments.jsx
import React, { useState } from 'react';
import { TrendingUp, ChevronRight, Gift } from 'lucide-react';
import { fmtUSD } from '../../Utils/formatters';
import { calculateAllInvestments } from '../../Utils/investmentUtils';

const ActiveInvestments = ({ investments = [], onViewDetails, onClaim }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [claimingId, setClaimingId] = useState(null);

  const calculatedInvestments = calculateAllInvestments(investments);

  const activeInvestments = calculatedInvestments.filter(inv => inv.status !== "completed");
  const completedInvestments = calculatedInvestments.filter(inv => inv.status === "completed");

  const totalInvested = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = activeInvestments.reduce((sum, inv) => sum + inv.current_value, 0);
  const totalReturns = totalCurrentValue - totalInvested;

  const handleClaim = async (investment) => {
    setClaimingId(investment.id);
    await onClaim?.(investment);
    setClaimingId(null);
  };

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

      <div className="space-y-4">
        {activeInvestments.map((investment) => {
          const isExpanded = expandedId === investment.id;
          const isClaiming = claimingId === investment.id;

          return (
            <div key={investment.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">{investment.plan_name}</h4>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                        investment.hasMatured
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {investment.hasMatured ? "Matured" : "Active"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Invested {fmtUSD(investment.amount)} on {new Date(investment.invested_at).toLocaleDateString()}
                    </p>
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
                    <p className="text-sm font-bold text-green-600">+{fmtUSD(investment.returns_earned)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{investment.hasMatured ? "Status" : "Days Left"}</p>
                    <p className="text-sm font-bold text-gray-900">
                      {investment.hasMatured ? "Ready to claim" : `${investment.daysLeft} days`}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 mb-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Progress to maturity</span>
                    <span className="font-semibold text-gray-900">{Math.round(investment.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`rounded-full h-2 transition-all duration-500 ${
                        investment.hasMatured
                          ? "bg-gradient-to-r from-amber-400 to-amber-500"
                          : "bg-gradient-to-r from-purple-400 to-purple-500"
                      }`}
                      style={{ width: `${investment.progress}%` }}
                    />
                  </div>
                </div>

                {investment.hasMatured && (
                  <button
                    onClick={() => handleClaim(investment)}
                    disabled={isClaiming}
                    className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-60"
                  >
                    {isClaiming ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Claiming...
                      </>
                    ) : (
                      <>
                        <Gift size={16} />
                        Claim {fmtUSD(investment.finalPayout)}
                      </>
                    )}
                  </button>
                )}

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
                        <p className="text-gray-500">Final Payout</p>
                        <p className="font-semibold text-purple-600">{fmtUSD(investment.finalPayout)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {completedInvestments.length > 0 && (
        <div className="mt-8">
          <h4 className="text-sm font-bold text-gray-500 mb-3">Claimed</h4>
          <div className="space-y-3">
            {completedInvestments.map(investment => (
              <div key={investment.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-700 text-sm">{investment.plan_name}</p>
                  <p className="text-xs text-gray-400">Invested {fmtUSD(investment.amount)}</p>
                </div>
                <p className="font-bold text-green-600 text-sm">+{fmtUSD(investment.current_value - investment.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveInvestments;