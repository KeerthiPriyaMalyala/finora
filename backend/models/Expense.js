const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Food',
          'Travel',
          'Bills',
          'Shopping',
          'Entertainment',
          'Health',
          'Education',
          'Salary',
          'Investment',
          'Others',
          'Grocery',
          'Fitness',
          'Transport',
          'Rent',
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Wallet'],
        message: '{VALUE} is not a valid payment method',
      },
      default: 'Cash',
    },
    transactionType: {
      type: String,
      enum: {
        values: ['expense', 'income'],
        message: 'Transaction type must be expense or income',
      },
      default: 'expense',
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    recurring: {
      type: Boolean,
      default: false,
    },
    recurringFrequency: {
      type: String,
      enum: {
        values: ['daily', 'weekly', 'monthly', 'yearly'],
        message: '{VALUE} is not a valid recurring frequency',
      },
      default: null,
    },
  },
  { timestamps: true }
);

expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });
expenseSchema.index({ user: 1, transactionType: 1 });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
