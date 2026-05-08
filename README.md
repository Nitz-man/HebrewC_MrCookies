# Kids Learning App 🎮

A comprehensive educational gaming platform for children with interactive games, progress tracking, and admin management panel.

## Features

### For Children (5 User Pages)
1. **Dashboard** - Home page with personalized greeting, level, score, and game selection
2. **Quizzes** - Answer questions about Hebrew words with translations
3. **Crosswords** - Fill in Hebrew words based on English clues
4. **Memory Cards** - Match pairs of Hebrew words and translations
5. **Leaderboard** - View class rankings and compare scores

### For Admin (3 Admin Pages)
1. **App Customization** - Control colors, sizes, music, and notifications
2. **Word Bank** - Add and manage Hebrew words for games (Hebrew language support)
3. **User Analytics** - Track user activity, levels, time spent, wrong answers with WhatsApp notifications

## Built With

- **Frontend**: React 18
- **Backend**: Node.js & Express
- **Styling**: CSS3 with Responsive Design
- **Authentication**: JWT tokens
- **Language Support**: Hebrew + English

## Project Structure

```
kids-learning-app/
├── backend/
│   ├── server.js           # Main Express server
│   ├── package.json        # Backend dependencies
│   ├── .env.example        # Environment variables
│   ├── data/
│   │   ├── users.js        # User database
│   │   ├── gameData.js     # Game words and content
│   │   └── adminSettings.js # Admin configuration
│   ├── routes/             # API routes
│   ├── controllers/        # Business logic
│   ├── middleware/         # Custom middleware
│   └── models/             # Data models
│
└── frontend/
    ├── public/
    │   └── index.html      # HTML entry point
    ├── src/
    │   ├── index.js        # React entry point
    │   ├── App.js          # Main App component with routing
    │   ├── pages/
    │   │   ├── LoginPage.js
    │   │   ├── Dashboard.js
    │   │   ├── Leaderboard.js
    │   │   ├── QuizGame.js
    │   │   ├── CrosswordGame.js
    │   │   ├── MemoryGame.js
    │   │   ├── AdminPortal.js
    │   │   ├── AdminTheme.js
    │   │   ├── AdminWordBank.js
    │   │   └── AdminAnalytics.js
    │   ├── styles/
    │   │   ├── App.css
    │   │   ├── LoginPage.css
    │   │   ├── Dashboard.css
    │   │   └── [other component styles]
    │   └── utils/          # Helper functions
    └── package.json        # Frontend dependencies
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Any modern web browser

### Installation

1. **Clone the repository**
```bash
cd c:\Users\User\Agents\kids-learning-app
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start Backend Server** (Terminal 1)
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

2. **Start Frontend Development Server** (Terminal 2)
```bash
cd frontend
npm start
# Frontend runs on http://localhost:3000
```

3. **Access the Application**
- Open browser to `http://localhost:3000`
- Login with one of the demo accounts

## Demo User Credentials

All demo users use password: `password123`

- **Itay** - username: `itay`
- **Tal** - username: `tal`
- **Leo** - username: `leo`
- **Ariel** - username: `ariel`
- **Dean** - username: `dean`
- **Ellie** - username: `ellie`

**Admin Portal**: Accessible from Dashboard (future implementation)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### User Routes
- `GET /api/users` - Get leaderboard
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id/score` - Update user score

### Game Routes
- `GET /api/games/words` - Get word bank
- `POST /api/games/words` - Add new word (Admin)
- `GET /api/games/quiz/generate` - Generate quiz
- `GET /api/games/memory/generate` - Generate memory game
- `GET /api/games/crossword/generate` - Generate crossword

### Admin Routes
- `GET /api/admin/settings` - Get app settings
- `PUT /api/admin/settings` - Update settings
- `GET /api/admin/analytics` - Get user analytics
- `POST /api/admin/notify/whatsapp` - Send WhatsApp notification

## Responsive Design

The application is fully responsive and optimized for:
- **Desktop** - Full grid layout with 4-column displays
- **Tablet** - 2-3 column responsive layout
- **Mobile** - Single column layout with touch-friendly buttons

## Styling Features

- **Gradient Backgrounds** - Modern purple-pink gradient theme
- **Animations** - Smooth fade-in, slide-in, and hover effects
- **Color Schemes** - Dynamic color support based on word difficulty
- **Roblox-style UI** - Playful, child-friendly interface
- **Hebrew Support** - Full RTL support for Hebrew text

## Scoring System

- **Quiz**: 10 points per correct answer
- **Crossword**: Points based on accuracy percentage
- **Memory**: 10 points per matched pair
- **Level Up**: Every 100 points increases level

## Notification System

- WhatsApp Web integration for parent notifications
- In-app notifications for achievements
- Customizable notification preferences

## Future Enhancements

- [ ] Voice-based quiz mode
- [ ] Multiplayer games
- [ ] Badges and achievements
- [ ] Custom avatar creation
- [ ] Sound effects and background music
- [ ] Mobile app version (React Native)
- [ ] Advanced analytics dashboard
- [ ] Teacher management portal
- [ ] Social sharing features

## Technical Notes

### Backend
- Express.js server for REST API
- Data stored locally (ready for database integration)
- JWT authentication with 24-hour tokens
- CORS enabled for frontend communication

### Frontend
- React Router for navigation
- Responsive CSS Grid and Flexbox
- Real-time score updates
- Dynamic game generation from word bank
- Secure token-based authentication

### Database Structure (Ready for Integration)
```javascript
Users: {
  id, username, password, fullName, avatar, level, score, 
  totalTime, gamesPlayed, createdAt
}

GameData: {
  wordBank: [{id, word, translation, difficulty, length}],
  quizzes: [],
  crosswords: [],
  memoryCards: []
}

AdminSettings: {
  appTheme: {primaryColor, secondaryColor, backgroundColor, textColor},
  layout: {buttonSize, fontSize, buttonSpacing},
  sounds: {enabled, correctAnswerSound, wrongAnswerSound},
  notifications: {whatsappEnabled, emailEnabled, inAppEnabled}
}
```

## Environment Variables

Create a `.env` file in the backend folder:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
WHATSAPP_API_KEY=your_whatsapp_api_key_here
NODE_ENV=development
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance Optimizations

- Lazy loading components
- Efficient re-rendering with React
- CSS animations instead of JS
- Local caching of user data
- Optimized image loading

## Security Features

- JWT token-based authentication
- Secure password handling (ready for bcrypt)
- CORS protection
- Input validation
- Environment variables for sensitive data

## License

This project is created for educational purposes.

## Support

For issues or questions, please refer to the documentation or create an issue in the project repository.

---

**Version**: 1.0.0  
**Last Updated**: May 8, 2026
