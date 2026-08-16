const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

function run(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
}

async function reset() {
    try {
        const dbPath = path.join(__dirname, "../data/data.db");

        // 1. Alte DB löschen
        try {
            await fs.unlink(dbPath);
            console.log("[RESET] Alte Datenbank gelöscht");
        } catch (err) {
            if (err.code !== "ENOENT") {
                throw err;
            }
        }

        // 2. Datenbank laden
        const db = require("./database.js");

        // 3. users erstellen
        await run(db, `
            CREATE TABLE IF NOT EXISTS users (
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                token TEXT NOT NULL
            )
        `);

        // 4. tw erstellen
        await run(db, `
            CREATE TABLE IF NOT EXISTS tw (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user TEXT,
                reason TEXT,
                von TEXT,
                datum TEXT
            )
        `);

        // 5. perso erstellen
        await run(db, `
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

        // 6. Admin erstellen
        const token = crypto.randomBytes(64).toString("hex");

        await run(
            db,
            "INSERT INTO users (username, password, token) VALUES (?, ?, ?)",
            ["admin", "admin", token]
        );

        console.log("[RESET] Datenbank erfolgreich zurückgesetzt");

        return true;

    } catch (err) {
        console.log(`[RESET] Fehler: ${err}`);
        return false;
    }
}

module.exports = reset;
