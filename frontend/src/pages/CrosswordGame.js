import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCrossword as generateCrosswordApi, updateScore } from '../utils/api';
import '../styles/CrosswordGame.css';

function CrosswordGame({ user }) {
  const navigate = useNavigate();
  const [crossword, setCrossword] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    generateCrossword();
  }, []);

  const generateCrossword = async () => {
    try {
      const data = await generateCrosswordApi(2);
      setCrossword(data);
      const initialAnswers = {};
      data.forEach(item => {
        initialAnswers[item.id] = '';
      });
      setAnswers(initialAnswers);
      setLoading(false);
    } catch (error) {
      console.error('Error generating crossword:', error);
      setLoading(false);
    }
  };

  const handleAnswerChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    crossword.forEach(item => {
      if (answers[item.id].trim().toLowerCase() === item.word.toLowerCase()) {
        correctCount++;
      }
    });

    const finalScore = (correctCount / crossword.length) * 100;
    setScore(finalScore);
    setShowAnswers(true);

    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime) / 1000);
    
    try {
      await updateScore(user.id, Math.round(finalScore), timeTaken, 'crossword');
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  if (loading) return <div className="loading">Loading crossword...</div>;

  if (!gameStarted) {
    return (
      <div className="crossword-container">
        <div className="crossword-start fade-in">
          <h1>🔤 Crossword Game</h1>
          <p>Fill in the Hebrew words based on the English clues!</p>
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

  return (
    <div className="crossword-container">
      <div className="crossword-header fade-in">
        <h1>🔤 Crossword Game</h1>
        {showAnswers && <div className="final-score">Score: {Math.round(score)}%</div>}
      </div>

      <div className="crossword-content">
        <div className="clues-section">
          {crossword.map((item) => (
            <div key={item.id} className={`crossword-item ${showAnswers && answers[item.id].toLowerCase() === item.word.toLowerCase() ? 'correct' : showAnswers ? 'incorrect' : ''}`}>
              <div className="clue">
                <span className="clue-number">{item.id + 1}</span>
                <span className="clue-text">{item.clue}</span>
              </div>
              <input
                type="text"
                className="answer-input"
                value={answers[item.id]}
                onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                placeholder="Type answer..."
                disabled={showAnswers}
                dir="rtl"
              />
              {showAnswers && (
                <div className={`answer-feedback ${answers[item.id].toLowerCase() === item.word.toLowerCase() ? 'correct' : 'incorrect'}`}>
                  {answers[item.id].toLowerCase() === item.word.toLowerCase() ? '✓' : `✗ ${item.word}`}
                </div>
              )}
            </div>
          ))}
        </div>

        {!showAnswers && (
          <button className="button button-primary button-large" onClick={handleSubmit}>
            Submit Answers
          </button>
        )}

        {showAnswers && (
          <button className="button button-primary button-large" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

export default CrosswordGame;
