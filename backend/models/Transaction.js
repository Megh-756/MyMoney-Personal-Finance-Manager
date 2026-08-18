const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  transfer_to_account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', default: null },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  amount: { type: Number, required: true, min: 0.01 },
  type: { type: String, required: true, enum: ['income', 'expense', 'transfer'] },
  date: { type: Date, required: true },
  remarks: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
