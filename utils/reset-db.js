const db = require("./database.js")
const fs = require("fs/promises");
const crypto = require("crypto")

async function reset() {
    // Alte DB Löschen
    await fs.unlink("../data/data.db");

    // Neue Tabellen Erstellen
    await db.run(`
                    CREATE TABLE IF NOT EXISTS users (
                        username TEXT NOT NULL UNIQUE,
                        password TEXT NOT NULL,
                        token TEXT NOT NULL
                    )
                `);

    db.run(`
    CREATE TABLE IF NOT EXISTS tw (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT,
        reason TEXT,
        von TEXT,
        datum TEXT
    )
`);

  // Standart Admin User Erstellen
  const token = crypto.randomBytes(128).toString("hex");
  await db.run(
    "INSERT INTO users (username, password, token) VALUES (?, ?, ?)",
    ["admin", "admin", token],
    (err) => {
        if (err) {
            console.log(`[RESET] Fehler beim Erstellen vom standart user: ${err}`)
        }
    }
);

                
}

module.exports = reset