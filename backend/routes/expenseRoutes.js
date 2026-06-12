

const express = require('express');
const router = express.Router();

const {
  addExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
 
} = require('../controllers/expenseController');



const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);


// ───────────────
// CREATE + GET ALL
// ───────────────
router.route('/')
  .post(addExpense)
  .get(getAllExpenses);

// ───────────────


// ───────────────
// SINGLE EXPENSE CRUD
// ───────────────
router.route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;