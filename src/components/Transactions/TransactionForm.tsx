import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText, Tag, IndianRupee } from 'lucide-react';
import type { Transaction } from './Transactions';

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSubmit: (data: Omit<Transaction, '_id'>) => void;
  onCancel: () => void;
}

const transactionTypes = [
  { value: 'income', label: 'Income', color: 'text-success-600', bgColor: 'bg-success-50', borderColor: 'border-success-200' },
  { value: 'expense', label: 'Expense', color: 'text-danger-600', bgColor: 'bg-danger-50', borderColor: 'border-danger-200' },
  { value: 'emi', label: 'EMI', color: 'text-warning-600', bgColor: 'bg-warning-50', borderColor: 'border-warning-200' }
];

const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Bonus', 'Business', 'Rental', 'Other'],
  expense: ['Food & Dining', 'Transportation', 'Utilities', 'Healthcare', 'Entertainment', 'Shopping', 'Education', 'Travel', 'Groceries', 'Other'],
  emi: ['Home Loan', 'Car Loan', 'Personal Loan', 'Credit Card', 'Education Loan', 'Other']
};

export default function TransactionForm({ transaction, onSubmit, onCancel }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense' | 'emi',
    category: '',
    amount: '',
    note: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount.toString(),
        note: transaction.note,
        date: new Date(transaction.date).toISOString().split('T')[0]
      });
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || parseFloat(formData.amount) <= 0) {
      return;
    }

    onSubmit({
      type: formData.type,
      category: formData.category,
      amount: parseFloat(formData.amount),
      note: formData.note,
      date: formData.date
    });

    // Reset form
    setFormData({
      type: 'expense',
      category: '',
      amount: '',
      note: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleTypeChange = (type: 'income' | 'expense' | 'emi') => {
    setFormData(prev => ({
      ...prev,
      type,
      category: '' // Reset category when type changes
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-large max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {transaction ? 'Edit Transaction' : 'Add New Transaction'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {transaction ? 'Update transaction details' : 'Enter transaction information'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Transaction Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {transactionTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleTypeChange(type.value as any)}
                  className={`p-4 text-sm font-semibold rounded-2xl border-2 transition-all duration-200 ${
                    formData.type === type.value
                      ? `${type.borderColor} ${type.bgColor} ${type.color} shadow-soft`
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                required
                className="input-field pl-12 appearance-none"
              >
                <option value="">Select a category</option>
                {categories[formData.type].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                required
                className="input-field pl-12"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
                className="input-field pl-12"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label htmlFor="note" className="block text-sm font-semibold text-gray-700 mb-2">
              Note (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <textarea
                id="note"
                value={formData.note}
                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                rows={3}
                className="input-field pl-12 resize-none"
                placeholder="Add a note about this transaction..."
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              {transaction ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}