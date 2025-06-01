
const express = require('express');
const { createWallet, getWallets } = require('../controllers/walletController');
const requireAuth = require('../middleware/authMiddleware');
const router = express.Router();

router.use(requireAuth);

router.post('/', createWallet);
router.get('/', getWallets);

module.exports = router;
