const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(path.join(__dirname, "../data/data.db"), (err) => {
    if (err) {
        throw new Error("Fehler Beim Öffnen der data/data.db")
    }
});

module.exports = db;