// Backend users database model
// This will store user data locally as JSON

const users = [
  {
    id: 1,
    username: "itay",
    password: "password123",
    fullName: "Itay",
    avatar: "avatar_1.png",
    level: 1,
    score: 150,
    totalTime: 1200,
    gamesPlayed: [
      { gameType: 'quiz', score: 80, time: 300, date: new Date('2026-05-08'), wrong: 2 },
      { gameType: 'memory', score: 70, time: 600, date: new Date('2026-05-07'), wrong: 3 }
    ],
    createdAt: new Date('2026-04-01')
  },
  {
    id: 2,
    username: "tal",
    password: "password123",
    fullName: "Tal",
    avatar: "avatar_2.png",
    level: 2,
    score: 250,
    totalTime: 1800,
    gamesPlayed: [
      { gameType: 'quiz', score: 90, time: 250, date: new Date('2026-05-08'), wrong: 1 },
      { gameType: 'crossword', score: 85, time: 400, date: new Date('2026-05-07'), wrong: 2 }
    ],
    createdAt: new Date('2026-03-15')
  },
  {
    id: 3,
    username: "leo",
    password: "password123",
    fullName: "Leo",
    avatar: "avatar_3.png",
    level: 1,
    score: 120,
    totalTime: 900,
    gamesPlayed: [
      { gameType: 'memory', score: 60, time: 900, date: new Date('2026-05-08'), wrong: 5 }
    ],
    createdAt: new Date('2026-04-20')
  },
  {
    id: 4,
    username: "ariel",
    password: "password123",
    fullName: "Ariel",
    avatar: "avatar_4.png",
    level: 2,
    score: 280,
    totalTime: 2100,
    gamesPlayed: [
      { gameType: 'quiz', score: 95, time: 200, date: new Date('2026-05-08'), wrong: 0 },
      { gameType: 'memory', score: 85, time: 500, date: new Date('2026-05-07'), wrong: 1 }
    ],
    createdAt: new Date('2026-03-01')
  },
  {
    id: 5,
    username: "dean",
    password: "password123",
    fullName: "Dean",
    avatar: "avatar_5.png",
    level: 1,
    score: 90,
    totalTime: 600,
    gamesPlayed: [
      { gameType: 'crossword', score: 75, time: 600, date: new Date('2026-05-06'), wrong: 3 }
    ],
    createdAt: new Date('2026-05-01')
  },
  {
    id: 6,
    username: "ellie",
    password: "password123",
    fullName: "Ellie",
    avatar: "avatar_6.png",
    level: 2,
    score: 300,
    totalTime: 2400,
    gamesPlayed: [
      { gameType: 'quiz', score: 100, time: 150, date: new Date('2026-05-08'), wrong: 0 },
      { gameType: 'memory', score: 95, time: 400, date: new Date('2026-05-07'), wrong: 0 },
      { gameType: 'crossword', score: 80, time: 300, date: new Date('2026-05-06'), wrong: 1 }
    ],
    createdAt: new Date('2026-02-15')
  }
];

module.exports = users;
