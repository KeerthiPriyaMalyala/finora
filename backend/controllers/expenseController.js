const Expense = require('../models/Expense');
const AppError = require('../utils/AppError');
const axios = require('axios');

const addExpense = async (req, res, next) => {
  try {
    const {
      amount,
      category,
      description,
      paymentMethod,
      transactionType,
      date,
      tags,
      recurring,
      recurringFrequency,
    } = req.body;

    // if (!amount || !category) {
    //   return next(new AppError('Amount and category are required', 400));
    // }
    if (!amount) {
  return next(new AppError('Amount is required', 400));
}
    let finalCategory = category;

if (!category && description) {
  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/predict',
      {
        text: description,
      }
    );

    finalCategory = response.data.category;

    console.log('🤖 Predicted Category:', finalCategory);
  } catch (mlError) {
    console.log('ML Prediction Failed:', mlError.message);

    finalCategory = 'Others';
  }
}

if (!finalCategory) {
  finalCategory = 'Others';
}
    const expense = await Expense.create({
      user: req.user.id,
      amount,
      category: finalCategory,
      description,
      paymentMethod,
      transactionType,
      date,
      tags,
      recurring,
      recurringFrequency: recurring ? recurringFrequency : null,
    });

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

const getAllExpenses = async (req, res, next) => {
  try {
    const {
      category,
      month,
      year,
      transactionType,
      search,
     
    } = req.query;

    const filter = { user: req.user.id };

    if (category) filter.category = category;
    if (transactionType) filter.transactionType = transactionType;
    if (search) filter.description = { $regex: search, $options: 'i' };

    if (month || year) {
      const targetYear = parseInt(year) || new Date().getFullYear();
      const targetMonth = parseInt(month);

      if (targetMonth) {
        const start = new Date(targetYear, targetMonth - 1, 1);
        const end = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);
        filter.date = { $gte: start, $lte: end };
      } else {
        const start = new Date(targetYear, 0, 1);
        const end = new Date(targetYear, 11, 31, 23, 59, 59, 999);
        filter.date = { $gte: start, $lte: end };
      }
    }

    
const expenses = await Expense.find(filter)
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      total: expenses.length,
      data: expenses,
    });
    
  } catch (error) {
    next(error);
  }
};

const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return next(new AppError('Expense not found', 404));
    }

    if (expense.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to access this expense', 403));
    }

    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return next(new AppError('Expense not found', 404));
    }

    if (expense.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to update this expense', 403));
    }

    const updates = req.body;

    if (updates.recurring === false) {
      updates.recurringFrequency = null;
    }

    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return next(new AppError('Expense not found', 404));
    }

    if (expense.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to delete this expense', 403));
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  addExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
 
};
