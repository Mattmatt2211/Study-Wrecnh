
const Wallet = require('../models/Wallet');

exports.createWallet = async (req, res) => {
  const { currency, balance } = req.body;
  try {
    const wallet = new Wallet({ userId: req.userId, currency, balance });
    await wallet.save();
    res.status(201).json(wallet);
  } catch (err) {
    res.status(400).json({ error: 'Could not create wallet' });
  }
};

exports.getWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find({ userId: req.userId });
    res.status(200).json(wallets);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch wallets' });
  }
};
