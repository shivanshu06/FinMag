import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import axios from 'axios';

export interface Transaction {
  _id: string;
  type: 'income' | 'expense' | 'emi';
  category: string;
  amount: number;
  note: string;
  date: string;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (transactionData: Omit<Transaction, '_id'>) => {
    try {
      const response = await axios.post('/transactions', transactionData);
      setTransactions(prev => [response.data, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleUpdateTransaction = async (id: string, transactionData: Partial<Transaction>) => {
    try {
      const response = await axios.put(`/transactions/${id}`, transactionData);
      setTransactions(prev => prev.map(t => t._id === id ? response.data : t));
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    
    try {
      await axios.delete(`/transactions/${id}`);
      setTransactions(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  // Calculate quick stats
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
  
  const monthlyIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyEmis = currentMonthTransactions
    .filter(t => t.type === 'emi')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card bg-gradient-to-br from-success-50 to-success-100 border-success-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-success-700">This Month Income</p>
              <p className="text-2xl font-bold text-success-900">{formatCurrency(monthlyIncome)}</p>
            </div>
            <div className="p-3 bg-success-200 rounded-2xl">
              <TrendingUp className="h-6 w-6 text-success-700" />
            </div>
          </div>
        </div>
        
        <div className="stat-card bg-gradient-to-br from-danger-50 to-danger-100 border-danger-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-danger-700">This Month Expenses</p>
              <p className="text-2xl font-bold text-danger-900">{formatCurrency(monthlyExpenses)}</p>
            </div>
            <div className="p-3 bg-danger-200 rounded-2xl">
              <TrendingDown className="h-6 w-6 text-danger-700" />
            </div>
          </div>
        </div>
        
        <div className="stat-card bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-warning-700">This Month EMIs</p>
              <p className="text-2xl font-bold text-warning-900">{formatCurrency(monthlyEmis)}</p>
            </div>
            <div className="p-3 bg-warning-200 rounded-2xl">
              <CreditCard className="h-6 w-6 text-warning-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Transactions</h2>
          <p className="text-gray-500 mt-1">Manage your financial transactions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Transaction Form Modal */}
      {(showForm || editingTransaction) && (
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={editingTransaction 
            ? (data) => handleUpdateTransaction(editingTransaction._id, data)
            : handleAddTransaction
          }
          onCancel={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
        />
      )}

      {/* Transaction List */}
      <TransactionList
        transactions={transactions}
        onEdit={setEditingTransaction}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
}