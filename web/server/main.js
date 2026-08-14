const express = require("express")
const data = require("../../data/data.json")
const db = require("../../utils/database.js")

const api = express();
api.use(express.json());
app.use(express.static(path.join(__dirname, "src")));


api.post("/api/sql", async (req, res) => {
    return;
});

api.post("/api/login", async (req, res) => {
    db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL,
                    password TEXT NOT NULL
                )
            `);
});


api.listen(data["http-server"].port, () => {});