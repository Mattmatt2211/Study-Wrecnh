
import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-12">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">ExpatWealth</h1>
        <nav className="space-x-4">
          <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
          <Link to="/signup" className="text-indigo-600 hover:underline">Sign Up</Link>
        </nav>
      </header>
      <main className="text-center">
        <h2 className="text-4xl font-bold mb-4">Manage Your Money Across Borders</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-6">
          ExpatWealth helps expats and nomads track finances, manage currencies, and control spending — all in one place.
        </p>
        <Link to="/signup" className="bg-indigo-600 text-white px-6 py-3 rounded shadow hover:bg-indigo-700">
          Get Started
        </Link>
      </main>
    </div>
  );
}
