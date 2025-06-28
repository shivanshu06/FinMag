import React, { useState } from 'react';
import { Edit2, Trash2, ArrowUpCircle, ArrowDownCircle, CreditCard, Filter, Search, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { Transaction } from './Transactions';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense' | 'emi'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredTransactions = transactions.filter(t => {
    const matchesType = filter === 'all' || t.type === filter;
    const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.note.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || t.date.startsWith(dateFilter);
    
    return matchesType && matchesSearch && matchesDate;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowUpCircle className="h-5 w-5 text-success-600" />;
      case 'expense':
        return <ArrowDownCircle className="h-5 w-5 text-danger-600" />;
      case 'emi':
        return <CreditCard className="h-5 w-5 text-warning-600" />;
      default:
        return <ArrowDownCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'text-success-600';
      case 'expense':
        return 'text-danger-600';
      case 'emi':
        return 'text-warning-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="card animate-slide-up">
      {/* Header with Filters */}
      <div className="card-header">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Transactions</h3>
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
            </div>
            
            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="month"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
              />
            </div>
            
            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="pl-10 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 appearance-none"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
                <option value="emi">EMIs</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="divide-y divide-gray-100">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h4>
            <p className="text-gray-500">Try adjusting your filters or add a new transaction</p>
          </div>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <div 
              key={transaction._id} 
              className="p-6 hover:bg-gray-50 transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 p-2 bg-gray-50 rounded-2xl">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <p className="text-base font-semibold text-gray-900 truncate">
                        {transaction.category}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        transaction.type === 'income' ? 'bg-success-100 text-success-800' :
                        transaction.type === 'expense' ? 'bg-danger-100 text-danger-800' :
                        'bg-warning-100 text-warning-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-sm text-gray-500 font-medium">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </p>
                      {transaction.note && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          "{transaction.note}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`text-xl font-bold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="p-2.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                      title="Edit transaction"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(transaction._id)}
                      className="p-2.5 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-xl transition-all duration-200"
                      title="Delete transaction"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}