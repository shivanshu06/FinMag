import React from 'react';
import { TrendingUp, TrendingDown, IndianRupee, CreditCard, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import type { FinancialSummary } from './Dashboard';

interface FinancialSummaryProps {
  summary: FinancialSummary;
}

export default function FinancialSummary({ summary }: FinancialSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const summaryCards = [
    {
      title: 'Total Income',
      amount: summary.income,
      icon: TrendingUp,
      bgGradient: 'from-emerald-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-900',
      trend: '+12.5%',
      trendIcon: ArrowUpRight,
      trendColor: 'text-emerald-600',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'Total Expenses',
      amount: summary.expenses,
      icon: TrendingDown,
      bgGradient: 'from-red-500 to-rose-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-rose-50',
      iconColor: 'text-red-600',
      textColor: 'text-red-900',
      trend: '+8.2%',
      trendIcon: ArrowUpRight,
      trendColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
    {
      title: 'EMIs',
      amount: summary.emis,
      icon: CreditCard,
      bgGradient: 'from-amber-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
      iconColor: 'text-amber-600',
      textColor: 'text-amber-900',
      trend: '0%',
      trendIcon: ArrowUpRight,
      trendColor: 'text-gray-500',
      borderColor: 'border-amber-200'
    },
    {
      title: 'Net Savings',
      amount: summary.netSavings,
      icon: Wallet,
      bgGradient: summary.netSavings >= 0 ? 'from-blue-500 to-indigo-600' : 'from-red-500 to-rose-600',
      bgColor: summary.netSavings >= 0 ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-gradient-to-br from-red-50 to-rose-50',
      iconColor: summary.netSavings >= 0 ? 'text-blue-600' : 'text-red-600',
      textColor: summary.netSavings >= 0 ? 'text-blue-900' : 'text-red-900',
      trend: summary.netSavings >= 0 ? '+15.3%' : '-5.2%',
      trendIcon: summary.netSavings >= 0 ? ArrowUpRight : ArrowDownRight,
      trendColor: summary.netSavings >= 0 ? 'text-emerald-600' : 'text-red-600',
      borderColor: summary.netSavings >= 0 ? 'border-blue-200' : 'border-red-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryCards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.trendIcon;
        return (
          <div
            key={index}
            className={`relative overflow-hidden bg-white rounded-3xl p-6 shadow-lg border ${card.borderColor} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-slide-up group`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Background gradient overlay */}
            <div className={`absolute inset-0 ${card.bgColor} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-7 w-7 ${card.iconColor}`} />
                </div>
                <div className={`flex items-center space-x-1 text-xs font-bold ${card.trendColor} bg-white bg-opacity-80 px-3 py-1 rounded-full`}>
                  <TrendIcon className="h-3 w-3" />
                  <span>{card.trend}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-3">
                  {card.title}
                </p>
                <p className={`text-3xl font-bold ${card.textColor} mb-2`}>
                  {formatCurrency(card.amount)}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  vs last month
                </p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
          </div>
        );
      })}
    </div>
  );
}