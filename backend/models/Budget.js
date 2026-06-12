const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
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
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    monthlyLimit: {
      type: Number,
      required: [true, 'Monthly limit is required'],
      min: [1, 'Monthly limit must be at least 1'],
    },
    spent: {
      type: Number,
      default: 0,
      min: 0,
    },
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    alertThreshold: {
      type: Number,
      default: 80,
      min: 1,
      max: 100,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

budgetSchema.virtual('remaining').get(function () {
  return Math.max(this.monthlyLimit - this.spent, 0);
});

budgetSchema.virtual('percentageUsed').get(function () {
  if (this.monthlyLimit === 0) return 0;
  return parseFloat(((this.spent / this.monthlyLimit) * 100).toFixed(2));
});

budgetSchema.virtual('isAlertTriggered').get(function () {
  return this.percentageUsed >= this.alertThreshold;
});

budgetSchema.index(
  { user: 1, category: 1, month: 1, year: 1 },
  { unique: true }
);

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
