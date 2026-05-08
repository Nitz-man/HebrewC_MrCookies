const fs = require('fs');
const path = require('path');

const usersSeed = require('./users');
const gameDataSeed = require('./gameData');
const adminSettingsSeed = require('./adminSettings');

const dataDirectory = process.env.DATA_DIR || __dirname;
const dbPath = path.join(dataDirectory, 'db.json');

const clone = (value) => JSON.parse(JSON.stringify(value));

const createSeedDatabase = () => ({
  users: clone(usersSeed),
  gameData: clone(gameDataSeed),
  adminSettings: clone(adminSettingsSeed)
});

const ensureDatabase = () => {
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(createSeedDatabase(), null, 2));
  }
};

const readDatabase = () => {
  ensureDatabase();
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
};

const writeDatabase = (database) => {
  fs.writeFileSync(dbPath, JSON.stringify(database, null, 2));
  return database;
};

const updateDatabase = (updater) => {
  const database = readDatabase();
  const result = updater(database);
  writeDatabase(database);
  return result;
};

module.exports = {
  readDatabase,
  writeDatabase,
  updateDatabase
};
