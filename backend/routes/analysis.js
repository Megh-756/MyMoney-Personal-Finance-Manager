const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// GET /api/analysis/monthly?month=2024-10
router.get('/monthly', auth, async (req, res) => {
  try {
    const monthStr = req.query.month || new Date().toISOString().slice(0, 7);
    const [year, month] = monthStr.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Summary: total income and expense
    const summary = await Transaction.aggregate([
      { $match: { user: userId, date: { $gte: startDate, $lte: endDate }, type: { $in: ['income', 'expense'] } } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);

    let income_total = 0, expense_total = 0;
    summary.forEach(s => {
      if (s._id === 'income') income_total = s.total;
      if (s._id === 'expense') expense_total = s.total;
    });

    // Category breakdown for expenses
    const expenseBreakdown = await Transaction.aggregate([
      { $match: { user: userId, date: { $gte: startDate, $lte: endDate }, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'cat' } },
      { $unwind: { path: '$cat', preserveNullAndEmptyArrays: true } },
      { $project: { name: { $ifNull: ['$cat.name', 'Uncategorized'] }, icon: { $ifNull: ['$cat.icon_name', 'label'] }, total: 1 } },
      { $sort: { total: -1 } }
    ]);

    // Category breakdown for income
    const incomeBreakdown = await Transaction.aggregate([
      { $match: { user: userId, date: { $gte: startDate, $lte: endDate }, type: 'income' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'cat' } },
      { $unwind: { path: '$cat', preserveNullAndEmptyArrays: true } },
      { $project: { name: { $ifNull: ['$cat.name', 'Uncategorized'] }, icon: { $ifNull: ['$cat.icon_name', 'label'] }, total: 1 } },
      { $sort: { total: -1 } }
    ]);

    res.json({ income_total, expense_total, net: income_total - expense_total, expense_breakdown: expenseBreakdown, income_breakdown: incomeBreakdown });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;