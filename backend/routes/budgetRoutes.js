const express = require('express');
const router = express.Router();

const {
  createBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  getBudgetStatus,
} = require('../controllers/budgetController');

const { protect } = require('../middleware/auth');

// 🔐 Protect all budget routes
router.use(protect);

// 📊 Status route
router.get('/status', getBudgetStatus);

// 💰 Budget CRUD
router.route('/')
  .post(createBudget)
  .get(getAllBudgets);

router.route('/:id')
  .get(getBudgetById)
  .put(updateBudget)
  .delete(deleteBudget);

module.exports = router;
