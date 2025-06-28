import React, { useState, useEffect } from 'react';
import FinancialSummary from './FinancialSummary';
import Charts from './Charts';
import axios from 'axios';

export interface Transaction {
  _id: string;
  type: 'income' | 'expense' | 'emi';
  category: string;
  amount: number;
  note: string;
  date: string;
}

export interface FinancialSummary {
  income: number;
  expenses: number;
  emis: number;
  netSavings: number;
  categoryBreakdown: Record<string, number>;
  totalTransactions: number;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await axios.get('/transactions/summary');
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-b-4 border-blue-300 opacity-75"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Financial Summary */}
      {summary && <FinancialSummary summary={summary} />}

      {/* Charts */}
      {summary && <Charts summary={summary} />}
    </div>
  );
}