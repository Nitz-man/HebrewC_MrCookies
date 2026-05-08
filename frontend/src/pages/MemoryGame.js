import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateMemoryGame as generateMemoryGameApi, updateScore } from '../utils/api';
import '../styles/MemoryGame.css';

function MemoryGame({ user }) {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    generateMemoryGame();
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      setTimeout(checkMatch, 500);
    }
  }, [flipped]);

  const generateMemoryGame = async () => {
    try {
      const data = await generateMemoryGameApi(2);
      setCards(data);
      setLoading(false);
    } catch (error) {
      console.error('Error generating memory game:', error);
      setLoading(false);
    }
  };

  const checkMatch = () => {
    const [first, second] = flipped;
    if (cards[first].content === cards[second].content) {
      setMatched([...matched, first, second]);
      setScore(score + 10);
      setFlipped([]);
    } else {
      setTimeout(() => setFlipped([]), 500);
    }
  };

  const handleCardClick = (index) => {
    if (flipped.includes(index) || matched.includes(index)) return;
    if (flipped.length < 2) {
      setFlipped([...flipped, index]);
    }
  };

  const handleFinish = async () => {
    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime) / 1000);
    
    try {
      await updateScore(user.id, score, timeTaken, 'memory');
    } catch (error) {
      console.error('Error updating score:', error);
    }
    
    navigate('/dashboard');
  };

  if (loading) return <div className="loading">Loading game...</div>;

  if (!gameStarted) {
    return (
      <div className="memory-container">
        <div className="memory-start fade-in">
          <h1>🎴 Memory Game</h1>
          <p>Match the pairs!</p>
          <button className="button button-primary button-large" onClick={() => setGameStarted(true)}>
            Start Game
          </button>
          <button className="button button-secondary" onClick={() => navigate('/dashboard')}>
            Back
          </button>
        </div>
      </div>
    );
  }

  const gameComplete = matched.length === cards.length;

  return (
    <div className="memory-container">
      <div className="memory-header fade-in">
        <h1>🎴 Memory Game</h1>
        <div className="game-stats">
          <span>Score: {score}</span>
          <span>Matched: {matched.length / 2}/{cards.length / 2}</span>
        </div>
      </div>

      <div className="memory-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`memory-card ${flipped.includes(index) || matched.includes(index) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{card.content}</div>
            </div>
          </div>
        ))}
      </div>

      {gameComplete && (
        <div className="game-complete fade-in">
          <h2>🎉 Congratulations!</h2>
          <p>You matched all pairs!</p>
          <p>Final Score: {score}</p>
          <button className="button button-primary button-large" onClick={handleFinish}>
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

export default MemoryGame;
