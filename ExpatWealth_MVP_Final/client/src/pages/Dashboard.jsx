
import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [wallets, setWallets] = useState([]);
  const [currency, setCurrency] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchWallets = async () => {
    const res = await fetch('http://localhost:5000/api/wallets', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setWallets(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/wallets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currency, balance })
      });
      if (!res.ok) throw new Error('Error creating wallet');
      setCurrency('');
      setBalance('');
      fetchWallets();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-6">
      <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">Your Wallets</h2>
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow-md">
        <form onSubmit={handleSubmit} className="mb-6">
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <input
            type="text"
            placeholder="Currency (e.g. USD)"
            value={currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            required
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="number"
            placeholder="Balance"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            required
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
          />
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded">
            Add Wallet
          </button>
        </form>
        <div>
          {wallets.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300 text-center">No wallets yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {wallets.map((wallet, idx) => (
                <li key={idx} className="py-3 flex justify-between">
                  <span>{wallet.currency}</span>
                  <span className="font-bold">{wallet.balance}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
