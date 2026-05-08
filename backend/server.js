const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import file-backed database helpers
const { readDatabase, updateDatabase } = require('./data/database');

// ==================== AUTHENTICATION ROUTES ====================

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;

    const { users } = readDatabase();

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // For demo purposes, accept password as is
    // In production, use bcrypt to compare hashed passwords
    if (user.password !== password && !password.startsWith('$2a$')) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        level: user.level,
        score: user.score
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== USER ROUTES ====================

// Get user profile
app.get('/api/users/:id', (req, res) => {
  try {
    const { users } = readDatabase();
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (leaderboard)
app.get('/api/users', (req, res) => {
  try {
    const { users } = readDatabase();
    const leaderboard = users
      .map(u => ({
        id: u.id,
        fullName: u.fullName,
        level: u.level,
        score: u.score,
        totalTime: u.totalTime,
        avatar: u.avatar
      }))
      .sort((a, b) => b.score - a.score);
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user score
app.put('/api/users/:id/score', (req, res) => {
  try {
    const { score = 0, time = 0, gameType = 'unknown', wrong = 0 } = req.body;
    const updatedUser = updateDatabase((database) => {
      const user = database.users.find(u => u.id === parseInt(req.params.id));

      if (!user) {
        return null;
      }

      user.score += Number(score);
      user.totalTime += Number(time);
      user.gamesPlayed.push({
        gameType,
        score: Number(score),
        time: Number(time),
        wrong: Number(wrong),
        date: new Date().toISOString()
      });

      // Update level based on score
      user.level = Math.floor(user.score / 100) + 1;
      user.lastActive = new Date().toISOString();

      return user;
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== GAME ROUTES ====================

// Get all words (word bank)
app.get('/api/games/words', (req, res) => {
  try {
    const { gameData } = readDatabase();
    res.json(gameData.wordBank);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add word to word bank (Admin only)
app.post('/api/games/words', (req, res) => {
  try {
    const { word, translation, difficulty } = req.body;

    const newWord = updateDatabase((database) => {
      const nextId = Math.max(0, ...database.gameData.wordBank.map(item => item.id)) + 1;

      const createdWord = {
        id: nextId,
        word,
        translation,
        difficulty: Number(difficulty),
        length: word.length
      };

      database.gameData.wordBank.push(createdWord);
      return createdWord;
    });

    res.status(201).json(newWord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove word from word bank (Admin only)
app.delete('/api/games/words/:id', (req, res) => {
  try {
    const wordId = parseInt(req.params.id);

    const deletedWord = updateDatabase((database) => {
      const wordIndex = database.gameData.wordBank.findIndex(word => word.id === wordId);

      if (wordIndex === -1) {
        return null;
      }

      const [removedWord] = database.gameData.wordBank.splice(wordIndex, 1);
      return removedWord;
    });

    if (!deletedWord) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.json({ message: 'Word removed', word: deletedWord });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate quiz from word bank
app.get('/api/games/quiz/generate', (req, res) => {
  try {
    const { gameData } = readDatabase();
    const { difficulty = 2, questions = 5 } = req.query;
    
    const filteredWords = gameData.wordBank.filter(
      w => w.difficulty <= difficulty
    );

    const quiz = [];
    for (let i = 0; i < questions && i < filteredWords.length; i++) {
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      const word = filteredWords[randomIndex];
      
      quiz.push({
        id: i + 1,
        word: word.word,
        translation: word.translation,
        difficulty: word.difficulty
      });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate memory game cards
app.get('/api/games/memory/generate', (req, res) => {
  try {
    const { gameData } = readDatabase();
    const { difficulty = 2 } = req.query;
    
    const filteredWords = gameData.wordBank.filter(
      w => w.difficulty <= difficulty
    );

    const pairs = [];
    for (let i = 0; i < Math.min(6, filteredWords.length); i++) {
      const word = filteredWords[i];
      pairs.push(
        { id: i * 2, type: 'word', content: word.word },
        { id: i * 2 + 1, type: 'translation', content: word.translation }
      );
    }

    // Shuffle array
    const cards = pairs.sort(() => Math.random() - 0.5);

    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate crossword (basic implementation)
app.get('/api/games/crossword/generate', (req, res) => {
  try {
    const { gameData } = readDatabase();
    const { difficulty = 2 } = req.query;
    
    const filteredWords = gameData.wordBank.filter(
      w => w.difficulty <= difficulty && w.length <= 8
    );

    const crossword = filteredWords.slice(0, 5).map((word, idx) => ({
      id: idx,
      word: word.word,
      clue: word.translation,
      position: { row: idx * 2, col: 0 }
    }));

    res.json(crossword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== ADMIN ROUTES ====================

// Get admin settings
app.get('/api/admin/settings', (req, res) => {
  try {
    const { adminSettings } = readDatabase();
    res.json(adminSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update admin settings
app.put('/api/admin/settings', (req, res) => {
  try {
    const { appTheme, layout, sounds, notifications, gameSettings } = req.body;

    const updatedSettings = updateDatabase((database) => {
      if (appTheme) Object.assign(database.adminSettings.appTheme, appTheme);
      if (layout) Object.assign(database.adminSettings.layout, layout);
      if (sounds) Object.assign(database.adminSettings.sounds, sounds);
      if (notifications) Object.assign(database.adminSettings.notifications, notifications);
      if (gameSettings) Object.assign(database.adminSettings.gameSettings, gameSettings);

      return database.adminSettings;
    });

    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user analytics
app.get('/api/admin/analytics', (req, res) => {
  try {
    const { users } = readDatabase();
    const analytics = users.map(user => ({
      id: user.id,
      fullName: user.fullName,
      level: user.level,
      score: user.score,
      totalTime: user.totalTime,
      gamesPlayed: user.gamesPlayed.length,
      wrongAnswers: user.gamesPlayed.reduce((acc, game) => acc + (game.wrong || 0), 0),
      lastActive: user.gamesPlayed.length > 0 ? user.gamesPlayed[user.gamesPlayed.length - 1].date : null
    }));

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send WhatsApp notification (integration point)
app.post('/api/admin/notify/whatsapp', (req, res) => {
  try {
    const { userId, message } = req.body;
    // Integration with WhatsApp Web API or Twilio
    console.log(`WhatsApp notification for user ${userId}: ${message}`);
    res.json({ status: 'sent', message: 'Notification queued' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== INITIAL USERNAMES & PASSWORDS ====================
/**
 * Default users created:
 * itay / password123
 * tal / password123
 * leo / password123
 * ariel / password123
 * dean / password123
 * ellie / password123
 * 
 * Admin panel credentials (to be added):
 * admin / admin123
 */

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', port: process.env.PORT || 5000 });
});

// Serve the React production build from the backend when deployed as one app.
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(frontendBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
