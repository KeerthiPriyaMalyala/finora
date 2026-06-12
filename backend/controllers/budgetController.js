const mongoose = require('mongoose');

const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const AppError = require('../utils/AppError');

const syncSpent = async (userId, category, month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);

  const result = await Expense.aggregate([
    {
      $match: {
        user: userId,
        category,
        transactionType: 'expense',
        date: { $gte: start, $lte: end },
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  return result.length > 0 ? result[0].total : 0;
};

const createBudget = async (req, res, next) => {
  try {
    const { category, monthlyLimit, month, year, alertThreshold } = req.body;

    if (!category || !monthlyLimit || !month || !year) {
      return next(new AppError('Category, monthlyLimit, month and year are required', 400));
    }

    const existing = await Budget.findOne({
      user: req.user.id,
      category,
      month,
      year,
    });

    if (existing) {
      return next(
        new AppError(
          `A budget for ${category} in ${month}/${year} already exists`,
          409
        )
      );
    }

    const spent = await syncSpent(new mongoose.Types.ObjectId(req.user.id), category, month, year);

    const budget = await Budget.create({
      user: req.user.id,
      category,
      monthlyLimit,
      month,
      year,
      alertThreshold: alertThreshold || 80,
      spent,
    });

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBudgets = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const filter = { user: req.user.id };

    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);

    const budgets = await Budget.find(filter).sort({ year: -1, month: -1 });

    const synced = await Promise.all(
      budgets.map(async (b) => {
        const spent = await syncSpent(new mongoose.Types.ObjectId(req.user.id), b.category, b.month, b.year);
      
        if (b.spent !== spent) {
          b.spent = spent;
          await b.save();
        }
        return b;
      })
    );

    res.status(200).json({
      success: true,
      count: synced.length,
      data: synced,
    });
  } catch (error) {
    next(error);
  }
};

const getBudgetById = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) return next(new AppError('Budget not found', 404));
    if (budget.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to access this budget', 403));
    }

    const spent = await syncSpent(new mongoose.Types.ObjectId(req.user.id), budget.category, budget.month, budget.year);
    budget.spent = spent;
    await budget.save();

    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    next(error);
  }
};

const updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) return next(new AppError('Budget not found', 404));
    if (budget.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to update this budget', 403));
    }

    const allowedUpdates = ['monthlyLimit', 'alertThreshold'];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) budget[field] = req.body[field];
    });

    await budget.save();

    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) return next(new AppError('Budget not found', 404));
    if (budget.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to delete this budget', 403));
    }

    await budget.deleteOne();

    res.status(200).json({ success: true, message: 'Budget deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getBudgetStatus = async (req, res, next) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const budgets = await Budget.find({ user: req.user.id, month, year });

    if (budgets.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No budgets set for this period',
        data: {
          month,
          year,
          totalBudget: 0,
          totalSpent: 0,
          totalRemaining: 0,
          percentageUsed: 0,
          categories: [],
          alerts: [],
        },
      });
    }

    const synced = await Promise.all(
      budgets.map(async (b) => {
        const spent = await syncSpent(new mongoose.Types.ObjectId(req.user.id), b.category, b.month, b.year);
        b.spent = spent;
        await b.save();
        return b;
      })
    );

    const totalBudget = synced.reduce((sum, b) => sum + b.monthlyLimit, 0);
    const totalSpent = synced.reduce((sum, b) => sum + b.spent, 0);
    const totalRemaining = Math.max(totalBudget - totalSpent, 0);
    const percentageUsed =
      totalBudget > 0
        ? parseFloat(((totalSpent / totalBudget) * 100).toFixed(2))
        : 0;

    const categories = synced.map((b) => ({
      category: b.category,
      monthlyLimit: b.monthlyLimit,
      spent: b.spent,
      remaining: b.remaining,
      percentageUsed: b.percentageUsed,
      alertThreshold: b.alertThreshold,
      isAlertTriggered: b.isAlertTriggered,
      status:
        b.spent > b.monthlyLimit
          ? 'over_budget'
          : b.isAlertTriggered
          ? 'warning'
          : 'on_track',
    }));

    const alerts = categories.filter((c) => c.isAlertTriggered);

    res.status(200).json({
      success: true,
      data: {
        month,
        year,
        totalBudget,
        totalSpent,
        totalRemaining,
        percentageUsed,
        categories,
        alerts,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  getBudgetStatus,
};
