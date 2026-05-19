// src/components/sheets/InvestSheet.jsx
import React, { useState } from 'react';
import { TrendingUp, X } from 'lucide-react';
import { fmtUSD } from '../../Utils/formatters';

export const InvestSheet = ({ isOpen, onClose, buyingPower = 0, onInvest }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [investAmount, setInvestAmount] = useState("");
  const [step, setStep] = useState(1);
  const [isInvesting, setIsInvesting] = useState(false);

  const investmentPlans = [
    { 
      id: 1, 
      name: "Starter Plan", 
      minAmount: 100, 
      return: "12% APY", 
      returnValue: 12,
      risk: "Low", 
      term: "30 days", 
      color: "emerald",
      description: "Perfect for beginners"
    },
    { 
      id: 2, 
      name: "Growth Plan", 
      minAmount: 500, 
      return: "18% APY", 
      returnValue: 18,
      risk: "Medium", 
      term: "60 days", 
      color: "yellow",
      description: "Balanced growth strategy"
    },
    { 
      id: 3, 
      name: "Premium Plan", 
      minAmount: 1000, 
      return: "25% APY", 
      returnValue: 25,
      risk: "High", 
      term: "90 days", 
      color: "red",
      description: "Maximum returns potential"
    },
  ];

  const handleInvest = async () => {
    setIsInvesting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onInvest(selectedPlan, parseFloat(investAmount));
    setIsInvesting(false);
    onClose();
    setStep(1);
    setSelectedPlan(null);
    setInvestAmount("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {step === 1 ? "Investment Plans" : step === 2 ? "Enter Amount" : "Confirm Investment"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {step === 1 ? "Choose your investment strategy" : step === 2 ? "Select amount to invest" : "Review your investment"}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${step >= s ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-400"}
                `}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-0.5 mx-2 ${step > s ? "bg-purple-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              {/* Available Balance */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Available Balance</span>
                  <span className="text-2xl font-bold text-gray-900">{fmtUSD(buyingPower || 0)}</span>
                </div>
              </div>

              {/* Investment Plans */}
              {investmentPlans.map(plan => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`
                    relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                    ${selectedPlan?.id === plan.id 
                      ? "border-purple-500 bg-purple-50 shadow-lg" 
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }
                  `}
                >
                  {selectedPlan?.id === plan.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      ✓
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{plan.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Min. {fmtUSD(plan.minAmount)}</p>
                    </div>
                    <div className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${plan.risk === "Low" ? "bg-emerald-100 text-emerald-700" :
                        plan.risk === "Medium" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"}
                    `}>
                      {plan.risk} Risk
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{plan.return}</p>
                      <p className="text-xs text-gray-500">Expected return</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700">{plan.term}</p>
                      <p className="text-xs text-gray-500">Lock period</p>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => selectedPlan && setStep(2)}
                disabled={!selectedPlan}
                className={`
                  w-full py-3 rounded-xl font-semibold transition-all duration-200
                  ${selectedPlan 
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                Continue to Amount →
              </button>
            </div>
          )}

          {step === 2 && selectedPlan && (
            <div className="space-y-6">
              {/* Selected Plan Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Selected Plan</p>
                    <p className="text-xl font-bold text-gray-900">{selectedPlan.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Expected Return</p>
                    <p className="text-xl font-bold text-purple-600">{selectedPlan.return}</p>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Investment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xl">$</span>
                  <input
                    type="number"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs">
                  <span className="text-gray-500">Min: {fmtUSD(selectedPlan.minAmount)}</span>
                  <button
                    onClick={() => setInvestAmount(buyingPower)}
                    className="text-purple-600 font-semibold hover:text-purple-700"
                  >
                    Max: {fmtUSD(buyingPower)}
                  </button>
                </div>
              </div>

              {/* Investment Preview */}
              {investAmount >= selectedPlan.minAmount && investAmount <= buyingPower && (
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                  <p className="text-sm font-semibold text-emerald-900 mb-2">Investment Preview</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Amount Invested:</span>
                      <span className="font-bold">{fmtUSD(parseFloat(investAmount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">Expected Return:</span>
                      <span className="font-bold text-emerald-900">
                        {fmtUSD(parseFloat(investAmount) * (selectedPlan.returnValue / 100))}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-emerald-200">
                      <span className="text-emerald-800 font-semibold">Total After {selectedPlan.term}:</span>
                      <span className="font-bold text-emerald-900">
                        {fmtUSD(parseFloat(investAmount) * (1 + selectedPlan.returnValue / 100))}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Messages */}
              {investAmount > 0 && investAmount < selectedPlan.minAmount && (
                <div className="bg-red-50 rounded-xl p-3 border border-red-200">
                  <p className="text-sm text-red-600 text-center">
                    Minimum investment is {fmtUSD(selectedPlan.minAmount)}
                  </p>
                </div>
              )}

              {investAmount > buyingPower && (
                <div className="bg-red-50 rounded-xl p-3 border border-red-200">
                  <p className="text-sm text-red-600 text-center">
                    Insufficient balance. Available: {fmtUSD(buyingPower)}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (investAmount >= selectedPlan.minAmount && investAmount <= buyingPower) {
                      setStep(3);
                    }
                  }}
                  disabled={investAmount < selectedPlan.minAmount || investAmount > buyingPower}
                  className={`
                    flex-1 py-3 rounded-xl font-semibold transition-all duration-200
                    ${investAmount >= selectedPlan.minAmount && investAmount <= buyingPower
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg" 
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  Review Investment →
                </button>
              </div>
            </div>
          )}

          {step === 3 && selectedPlan && investAmount && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp size={32} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Investment</h3>
                <p className="text-sm text-gray-500">Please review your investment details</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-semibold">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-gray-900">{fmtUSD(parseFloat(investAmount))}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Return Rate</span>
                  <span className="font-semibold text-purple-600">{selectedPlan.return}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Expected Return</span>
                  <span className="font-semibold text-green-600">
                    {fmtUSD(parseFloat(investAmount) * (selectedPlan.returnValue / 100))}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Lock Period</span>
                  <span className="font-semibold">{selectedPlan.term}</span>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200">
                <p className="text-xs text-yellow-800 text-center">
                  ⚠️ Funds will be locked for {selectedPlan.term}. Early withdrawal may incur penalties.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleInvest}
                  disabled={isInvesting}
                  className={`
                    flex-1 py-3 rounded-xl font-semibold transition-all duration-200
                    ${!isInvesting 
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg" 
                      : "bg-gray-300 cursor-not-allowed"
                    }
                  `}
                >
                  {isInvesting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    "Confirm Investment ✓"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default InvestSheet;