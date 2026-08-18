const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, enum: ['income', 'expense'] },
  icon_name: { type: String, default: 'label' }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
