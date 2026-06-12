

const Expense = require('../models/Expense');
const AppError = require('../utils/AppError');

const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({ user: userId }).sort({ date: -1 });

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap = {};
    const monthMap = {};

    expenses.forEach((item) => {
      const amount = item.amount;
      const isIncome = item.transactionType === 'income';

      if (isIncome) {
        totalIncome += amount;
      } else {
        totalExpense += amount;
        // category breakdown — expenses only
        if (!categoryMap[item.category]) categoryMap[item.category] = 0;
        categoryMap[item.category] += amount;
      }

      // monthly trend
      const d = new Date(item.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap[key]) monthMap[key] = { income: 0, expense: 0 };
      if (isIncome) {
        monthMap[key].income += amount;
      } else {
        monthMap[key].expense += amount;
      }
    });

    const savings = totalIncome - totalExpense;

    const categoryBreakdown = Object.keys(categoryMap).map((key) => ({
      category: key,
      total: categoryMap[key],
    }));

    const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyTrend = Object.keys(monthMap)
      .sort()
      .map((key) => {
        const month = parseInt(key.split('-')[1], 10) - 1;
        return {
          label: MONTH_LABELS[month],
          income: monthMap[key].income,
          expense: monthMap[key].expense,
        };
      });

    const recentTransactions = expenses.slice(0, 10);

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        savings,
        categoryBreakdown,
        monthlyTrend,
        recentTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData,
};