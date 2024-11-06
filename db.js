const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database('./ip.db', (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
    // Create lookup table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS lookup (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT,
        country TEXT,
        region TEXT,
        city TEXT,
        latitude TEXT,
        longitude TEXT,
        timezone TEXT,
        organization TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
});

module.exports = db;
