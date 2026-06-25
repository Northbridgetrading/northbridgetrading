// src/Utils/investmentUtils.js
// Calculates live profit for an investment based on elapsed time

export const calculateInvestmentState = (investment) => {
  const now = new Date();
  const investedAt = new Date(investment.invested_at);
  const maturityDate = new Date(investment.maturity_date);

  const totalTermMs = maturityDate - investedAt;
  const elapsedMs = now - investedAt;

  const progressRatio = Math.min(1, Math.max(0, elapsedMs / totalTermMs));

  const principal = investment.amount;
  const expectedReturnAmount = principal * (investment.expected_return_percent / 100);

  const returnsEarned = expectedReturnAmount * progressRatio;
  const currentValue = principal + returnsEarned;

  const daysLeft = Math.max(0, Math.ceil((maturityDate - now) / (1000 * 60 * 60 * 24)));
  const hasMatured = now >= maturityDate;

  const isClaimed = investment.status === "completed";

  return {
    ...investment,
    current_value: isClaimed ? investment.current_value : currentValue,
    returns_earned: isClaimed ? investment.returns_earned : returnsEarned,
    progress: progressRatio * 100,
    daysLeft,
    hasMatured: hasMatured && !isClaimed,
    isClaimed,
    finalPayout: principal + expectedReturnAmount,
  };
};

export const calculateAllInvestments = (investments = []) => {
  return investments.map(calculateInvestmentState);
};