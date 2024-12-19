import Transaction from "../models/transaction.js";

// Create Transactions
export const createTransaction = async (req, res) => {
  const { year, month, day, type, amount, desc } = req.body || {};

  // Validate required fields
  if (!year || !month || !day || !type || !amount || !desc) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Validate numeric fields
  if (
    isNaN(year) ||
    isNaN(month) ||
    isNaN(day) ||
    isNaN(amount) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return res.status(400).json({ message: "Invalid numeric values." });
  }

  // Validate type
  if (!["credit", "debit"].includes(type)) {
    return res
      .status(400)
      .json({ message: "Type must be 'credit' or 'debit'." });
  }

  // Create a new transaction
  const newTransaction = new Transaction({
    year: parseInt(year, 10),
    month: parseInt(month, 10),
    day: parseInt(day, 10),
    type,
    amount: parseFloat(amount),
    desc: desc.trim(),
    user: req.user._id
  });

  // Save the transaction to the database
  const createdTransaction = await newTransaction.save();

  res.status(201).json({
    data: createdTransaction,
  });
};

// Get All Transactions
export const getAllTransactions = async (req, res) => {
  const { year, month } = req.params;

  // Validate year
  if (!year || isNaN(year)) {
    return res
      .status(400)
      .json({ message: "Invalid or missing year parameter." });
  }

  const filter = { year: parseInt(year, 10), user: req.user, };

  // Include month in the filter if provided
  if (month) {
    if (isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ message: "Invalid month parameter." });
    }
    filter.month = parseInt(month, 10);
  }

  // Fetch transactions from the database
  const transactions = await Transaction.find(filter).sort({ day: 1 });

  if (transactions.length === 0) {
    return res.status(200).json({
      data: [],
    });
  }

  res.status(200).json({
    data: transactions,
  });
};

// Delete Transaction Controller
export const deleteTransaction = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Transaction ID is required." });
  }

  const transaction = await Transaction.findByIdAndDelete({
    _id: req.params.id,
    user: req.user,
  });

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found or not authorized." });
  }

  res.status(200).json({ message: "Transaction deleted successfully." });
};