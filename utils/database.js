const path = require("path");
const sqlite3 = require("sqlite3").verbose();

console.log("[Startup] Loading Database")

const db = new sqlite3.Database(path.join(__dirname, "../data/data.db"), (err) => {
    if (err) {
        throw new Error("Fehler Beim Öffnen der data/data.db")
    } else {
        console.log("[Startup] Database Loaded")
    }
});

module.exports = db;