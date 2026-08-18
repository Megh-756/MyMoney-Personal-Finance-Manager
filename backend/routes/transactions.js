const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

// GET /api/transactions
router.get('/', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1, createdAt: -1 })
      .limit(limit)
      .populate('account', 'name icon_name')
      .populate('transfer_to_account', 'name icon_name')
      .populate('category', 'name icon_name');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/transactions
router.post('/', auth, async (req, res) => {
  try {
    const { account, transfer_to_account, category, amount, type, date, remarks } = req.body;
    if (!account || !amount || !type || !date) return res.status(400).json({ message: 'Missing required fields' });

    // Validate account belongs to user
    const fromAccount = await Account.findOne({ _id: account, user: req.user.id });
    if (!fromAccount) return res.status(404).json({ message: 'Account not found' });

    const transaction = new Transaction({
      user: req.user.id, account, category: category || null,
      transfer_to_account: transfer_to_account || null,
      amount, type, date, remarks: remarks || ''
    });
    await transaction.save();

    // Update account balances
    if (type === 'income') {
      fromAccount.balance += parseFloat(amount);
      await fromAccount.save();
    } else if (type === 'expense') {
      if (fromAccount.balance < parseFloat(amount)) {
        await transaction.deleteOne();
        return res.status(400).json({ message: `Insufficient balance. Available: ${fromAccount.balance.toFixed(2)}` });
      }
      fromAccount.balance -= parseFloat(amount);
      await fromAccount.save();
    } else if (type === 'transfer') {
      const toAccount = await Account.findOne({ _id: transfer_to_account, user: req.user.id });
      if (!toAccount) return res.status(404).json({ message: 'Destination account not found' });
      if (fromAccount.balance < parseFloat(amount)) {
        await transaction.deleteOne();
        return res.status(400).json({ message: `Insufficient balance. Available: ${fromAccount.balance.toFixed(2)}` });
      }
      fromAccount.balance -= parseFloat(amount);
      toAccount.balance += parseFloat(amount);
      await fromAccount.save();
      await toAccount.save();
    }

    const populated = await transaction.populate([
      { path: 'account', select: 'name icon_name' },
      { path: 'transfer_to_account', select: 'name icon_name' },
      { path: 'category', select: 'name icon_name' }
    ]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/transactions/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const tx = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });

    // Reverse old balance effect
    const oldAccount = await Account.findById(tx.account);
    if (tx.type === 'income') oldAccount.balance -= tx.amount;
    else if (tx.type === 'expense') oldAccount.balance += tx.amount;
    else if (tx.type === 'transfer') {
      oldAccount.balance += tx.amount;
      if (tx.transfer_to_account) {
        const oldTo = await Account.findById(tx.transfer_to_account);
        if (oldTo) { oldTo.balance -= tx.amount; await oldTo.save(); }
      }
    }
    await oldAccount.save();

    // Apply new values
    const { amount, type, date, remarks, account, category, transfer_to_account } = req.body;
    tx.amount = amount || tx.amount;
    tx.type = type || tx.type;
    tx.date = date || tx.date;
    tx.remarks = remarks !== undefined ? remarks : tx.remarks;
    tx.account = account || tx.account;
    tx.category = category || tx.category;
    tx.transfer_to_account = transfer_to_account || null;
    await tx.save();

    // Apply new balance effect
    const newAccount = await Account.findById(tx.account);
    if (tx.type === 'income') newAccount.balance += tx.amount;
    else if (tx.type === 'expense') newAccount.balance -= tx.amount;
    else if (tx.type === 'transfer') {
      newAccount.balance -= tx.amount;
      if (tx.transfer_to_account) {
        const newTo = await Account.findById(tx.transfer_to_account);
        if (newTo) { newTo.balance += tx.amount; await newTo.save(); }
      }
    }
    await newAccount.save();

    const populated = await tx.populate([
      { path: 'account', select: 'name icon_name' },
      { path: 'transfer_to_account', select: 'name icon_name' },
      { path: 'category', select: 'name icon_name' }
    ]);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const tx = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });

    // Reverse balance
    const account = await Account.findById(tx.account);
    if (tx.type === 'income') account.balance -= tx.amount;
    else if (tx.type === 'expense') account.balance += tx.amount;
    else if (tx.type === 'transfer') {
      account.balance += tx.amount;
      if (tx.transfer_to_account) {
        const toAcc = await Account.findById(tx.transfer_to_account);
        if (toAcc) { toAcc.balance -= tx.amount; await toAcc.save(); }
      }
    }
    await account.save();
    await tx.deleteOne();
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
