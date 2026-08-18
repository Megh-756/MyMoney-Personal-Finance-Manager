const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// GET /api/accounts - get all accounts for user
router.get('/', auth, async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user.id }).sort({ createdAt: 1 });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/accounts - create account
router.post('/', auth, async (req, res) => {
  try {
    const { name, balance, icon_name, account_type } = req.body;
    if (!name) return res.status(400).json({ message: 'Account name required' });
    const account = new Account({ user: req.user.id, name, balance: balance || 0, icon_name: icon_name || 'account_balance_wallet', account_type: account_type || 'Bank' });
    await account.save();
    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/accounts/:id - update account
router.put('/:id', auth, async (req, res) => {
  try {
    const account = await Account.findOne({ _id: req.params.id, user: req.user.id });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    const { name, icon_name, account_type } = req.body;
    if (name) account.name = name;
    if (icon_name) account.icon_name = icon_name;
    if (account_type) account.account_type = account_type;
    await account.save();
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/accounts/:id - delete account
router.delete('/:id', auth, async (req, res) => {
  try {
    const account = await Account.findOne({ _id: req.params.id, user: req.user.id });
    if (!account) return res.status(404).json({ message: 'Account not found' });

    // Check for existing transactions
    const txCount = await Transaction.countDocuments({ $or: [{ account: req.params.id }, { transfer_to_account: req.params.id }] });
    if (txCount > 0) return res.status(400).json({ message: 'Cannot delete account with existing transactions' });
    if (account.balance !== 0) return res.status(400).json({ message: 'Cannot delete account with non-zero balance' });

    await account.deleteOne();
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
