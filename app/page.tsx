'use client';

import { useState, useEffect } from 'react';

interface Challenge {
  items: string[];
  oddIndex: number;
  category: string;
  difficulty: string;
}

const challenges: Challenge[] = [
  {
    items: ['🍎', '🍎', '🍎', '🍎', '🍊', '🍎', '🍎', '🍎'],
    oddIndex: 4,
    category: 'Fruits',
    difficulty: 'Easy'
  },
  {
    items: ['🐶', '🐶', '🐱', '🐶', '🐶', '🐶', '🐶', '🐶'],
    oddIndex: 2,
    category: 'Animals',
    difficulty: 'Easy'
  },
  {
    items: ['⚽', '⚽', '⚽', '🏀', '⚽', '⚽', '⚽', '⚽'],
    oddIndex: 3,
    category: 'Sports',
    difficulty: 'Easy'
  },
  {
    items: ['🚗', '🚗', '🚗', '🚗', '🚗', '🚙', '🚗', '🚗'],
    oddIndex: 5,
    category: 'Vehicles',
    difficulty: 'Medium'
  },
  {
    items: ['🌟', '🌟', '🌟', '⭐', '🌟', '🌟', '🌟', '🌟'],
    oddIndex: 3,
    category: 'Stars',
    difficulty: 'Medium'
  },
  {
    items: ['🎵', '🎵', '🎵', '🎵', '🎶', '🎵', '🎵', '🎵'],
    oddIndex: 4,
    category: 'Music',
    difficulty: 'Medium'
  },
  {
    items: ['💎', '💎', '💎', '💎', '💎', '💍', '💎', '💎'],
    oddIndex: 5,
    category: 'Jewelry',
    difficulty: 'Hard'
  },
  {
    items: ['🌸', '🌸', '🌺', '🌸', '🌸', '🌸', '🌸', '🌸'],
    oddIndex: 2,
    category: 'Flowers',
    difficulty: 'Hard'
  },
  {
    items: ['☕', '☕', '☕', '🍵', '☕', '☕', '☕', '☕'],
    oddIndex: 3,
    category: 'Beverages',
    difficulty: 'Hard'
  },
  {
    items: ['🎈', '🎈', '🎈', '🎈', '🎈', '🎈', '🎀', '🎈'],
    oddIndex: 6,
    category: 'Party',
    difficulty: 'Expert'
  }
];

export default function Home() {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isGameActive, setIsGameActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [totalAttempts, setTotalAttempts] = useState(0);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('oddOneOutHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  useEffect(() => {
    if (isGameActive && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isGameActive && !showResult) {
      handleTimeout();
    }
  }, [timeLeft, isGameActive, showResult]);

  const startGame = () => {
    setIsGameActive(true);
    setCurrentChallenge(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(15);
    setFeedback('');
    setSelectedIndex(null);
    setShowResult(false);
    setTotalAttempts(0);
  };

  const handleTimeout = () => {
    setFeedback('⏰ Time\'s up!');
    setStreak(0);
    setShowResult(true);
    setTotalAttempts(totalAttempts + 1);
    setTimeout(nextChallenge, 2000);
  };

  const handleClick = (index: number) => {
    if (showResult || !isGameActive) return;

    setSelectedIndex(index);
    setTotalAttempts(totalAttempts + 1);

    const challenge = challenges[currentChallenge];
    if (index === challenge.oddIndex) {
      const points = Math.ceil(timeLeft / 3) * (streak + 1);
      setScore(score + points);
      setStreak(streak + 1);
      setFeedback(`🎉 Correct! +${points} points`);

      const newScore = score + points;
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('oddOneOutHighScore', newScore.toString());
      }
    } else {
      setFeedback('❌ Wrong! Try again or wait for next.');
      setStreak(0);
    }

    setShowResult(true);
    setTimeout(nextChallenge, 2000);
  };

  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setTimeLeft(15);
      setFeedback('');
      setSelectedIndex(null);
      setShowResult(false);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setIsGameActive(false);
    setFeedback(`🎮 Game Over! Final Score: ${score}`);
  };

  const challenge = challenges[currentChallenge];
  const accuracy = totalAttempts > 0 ? Math.round((score / (totalAttempts * 5)) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            Find the Odd One Out
          </h1>
          <p className="text-gray-600 text-lg">Test your observation skills!</p>
        </div>

        {!isGameActive ? (
          <div className="text-center">
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
              <p className="text-6xl mb-4">🧠</p>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Play?</h2>
              <p className="text-gray-600 mb-4">
                Find the different emoji before time runs out!
              </p>
              <div className="grid grid-cols-2 gap-4 text-left max-w-md mx-auto mb-6">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-gray-600">High Score</p>
                  <p className="text-2xl font-bold text-purple-600">{highScore}</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Challenges</p>
                  <p className="text-2xl font-bold text-pink-600">{challenges.length}</p>
                </div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-full text-xl font-bold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Start Game
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div className="flex gap-4">
                <div className="bg-gradient-to-r from-purple-100 to-purple-200 px-6 py-3 rounded-full">
                  <p className="text-sm text-purple-700 font-semibold">Score</p>
                  <p className="text-2xl font-bold text-purple-900">{score}</p>
                </div>
                <div className="bg-gradient-to-r from-pink-100 to-pink-200 px-6 py-3 rounded-full">
                  <p className="text-sm text-pink-700 font-semibold">Streak</p>
                  <p className="text-2xl font-bold text-pink-900">{streak} 🔥</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-100 to-orange-200 px-6 py-3 rounded-full">
                <p className="text-sm text-red-700 font-semibold">Time</p>
                <p className="text-2xl font-bold text-red-900">{timeLeft}s</p>
              </div>
            </div>

            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-semibold text-gray-800">
                  {challenge.category}
                </p>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  challenge.difficulty === 'Easy' ? 'bg-green-200 text-green-800' :
                  challenge.difficulty === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                  challenge.difficulty === 'Hard' ? 'bg-orange-200 text-orange-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentChallenge + 1) / challenges.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Challenge {currentChallenge + 1} of {challenges.length}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              {challenge.items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  disabled={showResult}
                  className={`aspect-square text-6xl flex items-center justify-center rounded-2xl transition-all duration-200 transform hover:scale-110 ${
                    showResult && index === challenge.oddIndex
                      ? 'bg-green-500 pulse-correct shadow-lg'
                      : showResult && index === selectedIndex && index !== challenge.oddIndex
                      ? 'bg-red-500 shake-wrong shadow-lg'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 shadow-md'
                  } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {item}
                </button>
              ))}
            </div>

            {feedback && (
              <div className={`text-center p-4 rounded-2xl mb-4 font-bold text-xl ${
                feedback.includes('Correct')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {feedback}
              </div>
            )}

            <div className="text-center text-gray-600">
              <p className="text-sm">💡 Click on the emoji that looks different!</p>
              {streak > 0 && (
                <p className="text-sm mt-1 text-purple-600 font-semibold">
                  Keep your streak for bonus points!
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-6 text-white text-center">
        <p className="text-sm opacity-80">Perfect for YouTube challenges and brain teasers!</p>
        <p className="text-xs opacity-60 mt-1">Share your high score in the comments!</p>
      </div>
    </div>
  );
}
