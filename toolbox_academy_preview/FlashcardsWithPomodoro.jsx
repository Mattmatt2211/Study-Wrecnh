// FlashcardsWithPomodoro.jsx
import React, { useState, useEffect } from 'react';

const flashcards = [
  { front: 'What is Ohm\'s Law?', back: 'V = IR (Voltage = Current x Resistance)' },
  { front: 'HVAC: What does BTU stand for?', back: 'British Thermal Unit' },
  { front: 'Plumbing: What is the standard pipe size for a kitchen sink?', back: '1 1/2 inches' },
];

const POMODORO_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60; // 5 minutes

export default function FlashcardsWithPomodoro() {
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [time, setTime] = useState(POMODORO_TIME);
  const [onBreak, setOnBreak] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setOnBreak((prevBreak) => {
            const next = !prevBreak;
            setTime(next ? BREAK_TIME : POMODORO_TIME);
            return next;
          });
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [time]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Flashcards & Pomodoro</h1>
      <div className="text-center mb-4">
        <div className={`text-xl font-semibold ${onBreak ? 'text-green-600' : 'text-red-600'}`}>
          {onBreak ? 'Break Time' : 'Focus Time'}
        </div>
        <div className="text-4xl font-mono">{formatTime(time)}</div>
      </div>
      <div
        className="border rounded-lg p-8 text-center cursor-pointer bg-gray-100"
        onClick={() => setFlipped(!flipped)}
      >
        {flipped ? flashcards[currentCard].back : flashcards[currentCard].front}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => {
            setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
            setFlipped(false);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Previous
        </button>
        <button
          onClick={() => {
            setCurrentCard((prev) => (prev + 1) % flashcards.length);
            setFlipped(false);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
