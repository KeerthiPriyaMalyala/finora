const Groq = require("groq-sdk");
const Expense = require("../models/Expense");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const chatWithFinora = async (req, res, next) => {
  try {
    const { message } = req.body;

    const expenses = await Expense.find({
      user: req.user.id,
    });

    let totalExpense = 0;
    const categories = {};

    expenses.forEach((item) => {
      if (item.transactionType === "expense") {
        totalExpense += item.amount;

        categories[item.category] =
          (categories[item.category] || 0) + item.amount;
      }
    });

    const financeContext = `
Total Expenses: ₹${totalExpense}

Category Breakdown:
${Object.entries(categories)
        .map(([cat, amount]) => `${cat}: ₹${amount}`)
        .join("\n")}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are Finora AI.

You are a personal finance assistant.

Analyze user spending patterns.

Give practical finance advice.

Keep answers short and useful.
          `,
        },
        {
          role: "system",
          content: financeContext,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
    });

    res.status(200).json({
      success: true,
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  chatWithFinora,
};