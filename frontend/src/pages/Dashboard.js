import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserStats } from '../utils/api';
import '../styles/Dashboard.css';

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState(user);
  const [loading, setLoading] = useState(false);

  const gameButtons = [
    {
      id: 1,
      title: 'Quizzes',
      description: 'Answer questions',
      icon: '❓',
      path: '/quiz',
      color: 'quiz'
    },
    {
      id: 2,
      title: 'Crosswords',
      description: 'Fill the crossword',
      icon: '🔤',
      path: '/crossword',
      color: 'crossword'
    },
    {
      id: 3,
      title: 'Memory Cards',
      description: 'Match the pairs',
      icon: '🎴',
      path: '/memory',
      color: 'memory'
    },
    {
      id: 4,
      title: 'Leaderboard',
      description: 'See rankings',
      icon: '🏆',
      path: '/leaderboard',
      color: 'leaderboard'
    }
  ];

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const data = await getUserStats(user.id);
      setUserStats(data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handlePlayGame = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header fade-in">
        <div className="header-content">
          <div className="user-greeting">
            <h1>Welcome, <span className="user-name">{userStats.fullName}!</span> 🎮</h1>
          </div>
          <button className="button button-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Stats Section */}
      <section className="stats-section slide-in">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Level</div>
            <div className="stat-value">{userStats.level}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Score</div>
            <div className="stat-value">{userStats.score}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Time (min)</div>
            <div className="stat-value">{Math.round(userStats.totalTime / 60)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Games Played</div>
            <div className="stat-value">{userStats.gamesPlayed?.length || 0}</div>
          </div>
        </div>
      </section>

      {/* Game Buttons Section */}
      <section className="games-section">
        <h2 className="section-title">Choose a Game</h2>
        <div className="games-grid">
          {gameButtons.map((game, index) => (
            <button
              key={game.id}
              className={`game-button ${game.color}`}
              onClick={() => handlePlayGame(game.path)}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="game-icon">{game.icon}</div>
              <div className="game-title">{game.title}</div>
              <div className="game-description">{game.description}</div>
              <div className="arrow">→</div>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Progress */}
      <section className="recent-section">
        <h2 className="section-title">Quick Stats</h2>
        <div className="progress-card">
          <div className="progress-item">
            <span>Level Progress</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${((userStats.score % 100) / 100) * 100}%`}}></div>
            </div>
            <span className="progress-text">{userStats.score % 100}/100 points to next level</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
