const db = require("./database.js")
const fs = require("fs/promises");
const crypto = require("crypto")

async function reset() {
    try {
    // Alte DB Löschen
    try {
    await fs.unlink("../data/data.db");
    } catch (err) {
       
    }

    // Neue Tabellen Erstellen
    await db.run(`
                    CREATE TABLE IF NOT EXISTS users (
                        username TEXT NOT NULL UNIQUE,
                        password TEXT NOT NULL,
                        token TEXT NOT NULL
                    )
                `);

    await db.run(`
    CREATE TABLE IF NOT EXISTS tw (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT,
        reason TEXT,
        von TEXT,
        datum TEXT
    )
`);

await db.run(`
    CREATE TABLE IF NOT EXISTS perso (
        username TEXT NOT NULL UNIQUE,
        name TEXT,
        geburt TEXT,
        pkw TEXT,
        lkw TEXT,
        motorrad TEXT,
        waffe_klein TEXT,
        waffe_groß TEXT
    )
`);



  // Standart Admin User Erstellen
  const token = crypto.randomBytes(64).toString("hex");
  await db.run(
    "INSERT INTO users (username, password, token) VALUES (?, ?, ?)",
    ["admin", "admin", token],
    (err) => {
        if (err) {
            console.log(`[RESET] Fehler beim Erstellen vom standart user: ${err}`)
        }
    }
);

} catch (err) {
    console.log(`[RESET] Fehler: ${err}`)
    return false
}

return true      
}

module.exports = reset