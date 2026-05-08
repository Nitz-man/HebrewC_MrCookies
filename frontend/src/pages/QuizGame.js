import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuiz as generateQuizApi, updateScore } from '../utils/api';
import '../styles/QuizGame.css';

function QuizGame({ user }) {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    generateQuiz();
  }, []);

  const generateQuiz = async () => {
    try {
      const data = await generateQuizApi(2, 5);
      setQuiz(data);
      setLoading(false);
    } catch (error) {
      console.error('Error generating quiz:', error);
      setLoading(false);
    }
  };

  const handleAnswerClick = (answer) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    
    if (answer === quiz[currentQuestion].translation) {
      setScore(score + 10);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Game finished
      const endTime = Date.now();
      const timeTaken = Math.round((endTime - startTime) / 1000);
      const finalScore = selectedAnswer === quiz[currentQuestion].translation ? score + 10 : score;
      
      try {
        await updateScore(user.id, finalScore, timeTaken, 'quiz');
      } catch (error) {
        console.error('Error updating score:', error);
      }
      
      navigate('/dashboard');
    }
  };

  if (loading) return <div className="loading">Loading quiz...</div>;

  if (!gameStarted) {
    return (
      <div className="quiz-container">
        <div className="quiz-start fade-in">
          <h1>❓ Quiz Game</h1>
          <p>Test your knowledge!</p>
          <button className="button button-primary button-large" onClick={() => setGameStarted(true)}>
            Start Quiz
          </button>
          <button className="button button-secondary" onClick={() => navigate('/dashboard')}>
            Back
          </button>
        </div>
      </div>
    );
  }

  const currentQ = quiz[currentQuestion];
  const allAnswers = [
    currentQ.translation,
    'Fake Answer 1',
    'Fake Answer 2',
    'Fake Answer 3'
  ].sort(() => Math.random() - 0.5);

  return (
    <div className="quiz-container">
      <div className="quiz-content fade-in">
        <div className="quiz-header">
          <div className="progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${((currentQuestion + 1) / quiz.length) * 100}%`}}></div>
            </div>
            <span>{currentQuestion + 1}/{quiz.length}</span>
          </div>
          <div className="score-display">Score: {score}</div>
        </div>

        <div className="question-section">
          <div className="question-text">
            <p>What is the English translation of:</p>
            <h2 className="word">{currentQ.word}</h2>
          </div>

          <div className="answers-grid">
            {allAnswers.map((answer, idx) => (
              <button
                key={idx}
                className={`answer-button ${selectedAnswer === answer ? (answer === currentQ.translation ? 'correct' : 'wrong') : ''}`}
                onClick={() => handleAnswerClick(answer)}
                disabled={selectedAnswer !== null}
              >
                {answer}
              </button>
            ))}
          </div>

          {selectedAnswer && (
            <button className="button button-primary" onClick={handleNext}>
              {currentQuestion === quiz.length - 1 ? 'Finish' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizGame;
