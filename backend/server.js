require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
// 
const chatRoutes = require("./routes/chatRoutes");
//

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Finora API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/budget', budgetRoutes);

app.use('/api/chat', chatRoutes);
//

//
app.get("/api/test-db", async (req, res) => {
  const mongoose = require("mongoose");

  res.json({
    readyState: mongoose.connection.readyState
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Finora API server running on port ${PORT}`);
});


