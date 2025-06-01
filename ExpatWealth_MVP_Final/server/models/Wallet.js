
const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currency: { type: String, required: true },
  balance: { type: Number, default: 0 }
});

module.exports = mongoose.model('Wallet', WalletSchema);
