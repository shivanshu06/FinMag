import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import axios from 'axios';
import type { FinancialSummary } from './Dashboard';

interface ChartsProps {
  summary: FinancialSummary;
}

interface TrendData {
  month: string;
  income: number;
  expenses: number;
  emis: number;
  savings: number;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

export default function Charts({ summary }: ChartsProps) {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const response = await axios.get('/transactions/trends');
      setTrends(response.data);
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for pie chart
  const categoryData = Object.entries(summary.categoryBreakdown).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  // Custom tooltip for currency formatting
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-2xl shadow-2xl animate-scale-in backdrop-blur-sm">
          <p className="font-bold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-semibold">
              {entry.name}: ₹{entry.value.toLocaleString('en-IN')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-2xl shadow-2xl animate-scale-in backdrop-blur-sm">
          <p className="font-bold text-gray-900 mb-1">{data.name}</p>
          <p className="text-sm font-semibold" style={{ color: data.payload.fill }}>
            ₹{data.value.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-gray-500">
            {((data.value / categoryData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-3xl shadow-lg border border-gray-100 animate-pulse">
            <div className="p-6 border-b border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="p-6">
              <div className="h-80 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown Pie Chart */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 animate-slide-up">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Expense Categories</h3>
            <p className="text-sm text-gray-500 mt-1">Breakdown of your spending</p>
          </div>
          <div className="p-6">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => percent > 5 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={3}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-500">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PieChart className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="font-semibold text-lg">No expense data available</p>
                  <p className="text-sm text-gray-400">Start adding expenses to see the breakdown</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Financial Trends Line Chart */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Financial Trends</h3>
            <p className="text-sm text-gray-500 mt-1">Last 6 months overview</p>
          </div>
          <div className="p-6">
            {trends.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#64748b"
                    fontSize={12}
                    fontWeight={600}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                    fontWeight={600}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#10B981" 
                    strokeWidth={4}
                    dot={{ r: 6, fill: '#10B981', strokeWidth: 3, stroke: '#fff' }}
                    name="Income"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#EF4444" 
                    strokeWidth={4}
                    dot={{ r: 6, fill: '#EF4444', strokeWidth: 3, stroke: '#fff' }}
                    name="Expenses"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="savings" 
                    stroke="#3B82F6" 
                    strokeWidth={4}
                    dot={{ r: 6, fill: '#3B82F6', strokeWidth: 3, stroke: '#fff' }}
                    name="Savings"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-500">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LineChart className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="font-semibold text-lg">No trend data available</p>
                  <p className="text-sm text-gray-400">Add more transactions to see trends</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Comparison Bar Chart */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 animate-slide-up" style={{ animationDelay: '300ms' }}>
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Monthly Comparison</h3>
          <p className="text-sm text-gray-500 mt-1">Income vs Expenses vs EMIs</p>
        </div>
        <div className="p-6">
          {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={trends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b"
                  fontSize={12}
                  fontWeight={600}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  fontWeight={600}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" fill="#10B981" name="Income" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[6, 6, 0, 0]} />
                <Bar dataKey="emis" fill="#F59E0B" name="EMIs" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-500">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart className="w-10 h-10 text-gray-400" />
                </div>
                <p className="font-semibold text-lg">No comparison data available</p>
                <p className="text-sm text-gray-400">Add transactions to see monthly comparisons</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}