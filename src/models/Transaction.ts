// import mongoose from 'mongoose';

// const TransactionSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   type: {
//     type: String,
//     enum: ['income', 'expense', 'emi'],
//     required: true
//   },
//   category: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   amount: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   note: {
//     type: String,
//     trim: true,
//     default: ''
//   },
//   date: {
//     type: Date,
//     required: true,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// // Index for efficient queries
// TransactionSchema.index({ userId: 1, date: -1 });
// TransactionSchema.index({ userId: 1, type: 1 });

// export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);


import mongoose, { Document, Schema, Types } from 'mongoose';

// Define the Transaction type enum
export type TransactionType = 'income' | 'expense' | 'emi';

// Define the Transaction interface extending Mongoose Document
export interface ITransaction extends Document {
  userId: Types.ObjectId;
  type: TransactionType;
  category: string;
  amount: number;
  note: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'emi'] as const,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  note: {
    type: String,
    trim: true,
    default: ''
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, type: 1 });

// Export the model with proper typing
const Transaction = mongoose.models.Transaction as mongoose.Model<ITransaction> || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;