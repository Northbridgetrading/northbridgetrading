// src/hooks/useInvestments.js
import { useState, useEffect } from 'react';

export const useInvestments = () => {
  const [activeInvestments, setActiveInvestments] = useState(() => {
    const saved = localStorage.getItem('activeInvestments');
    return saved ? JSON.parse(saved) : [];
  });
  const [buyingPower, setBuyingPower] = useState(10000); // You'll connect this to your actual buying power

  useEffect(() => {
    localStorage.setItem('activeInvestments', JSON.stringify(activeInvestments));
  }, [activeInvestments]);

  const createInvestment = (plan, amount) => {
    const newInvestment = {
      id: Date.now(),
      planName: plan.name,
      amount: amount,
      investedAt: new Date().toISOString().split('T')[0],
      maturityDate: new Date(
        Date.now() + (
          plan.term === '30 days' ? 30 : 
          plan.term === '60 days' ? 60 : 90
        ) * 24 * 60 * 60 * 1000
      ).toISOString().split('T')[0],
      expectedReturn: plan.returnValue,
      currentValue: amount,
      returns: 0,
      progress: 0,
      status: 'active',
      nextPayout: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      planId: plan.id,
      returnRate: plan.returnValue
    };

    setActiveInvestments(prev => [...prev, newInvestment]);
    setBuyingPower(prev => prev - amount);
    
    alert(`Successfully invested $${amount} in ${plan.name}!`);
    return newInvestment;
  };

  return {
    activeInvestments,
    buyingPower,
    setBuyingPower,
    createInvestment
  };
};