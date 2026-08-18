const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  balance: { type: Number, default: 0 },
  icon_name: { type: String, default: 'account_balance_wallet' },
  account_type: { type: String, default: 'Bank', enum: ['Bank', 'Cash', 'Credit Card', 'Investment', 'Other'] }
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);
