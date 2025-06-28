import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user._id;
    const trends = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const transactions = await Transaction.find({
        userId,
        date: { $gte: startOfMonth, $lte: endOfMonth }
      });

      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const emis = transactions
        .filter(t => t.type === 'emi')
        .reduce((sum, t) => sum + t.amount, 0);

      trends.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        income,
        expenses,
        emis,
        savings: income - expenses - emis
      });
    }

    return NextResponse.json(trends);
  } catch (error) {
    console.error('Get trends error:', error);
    return NextResponse.json(
      { message: 'Server error fetching trends' },
      { status: 500 }
    );
  }
}