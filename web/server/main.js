const express = require("express")
const path = require("path")
const data = require("../../data/data.json")
const db = require("../../utils/database.js")

console.log("[Web Server] Loading")

const api = express();
api.use(express.json());
api.use(express.static(path.join(__dirname, "../src")));

db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    username TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    token TEXT NOT NULL
                )
            `);



api.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, row) => {
        if (err) {
            return res.status(500).json({ "error": "500" })
        }

        if (!row) {
            return res.status(401).json({ "error": "user_pass" })
        }

        if (password === row.password) {
            res.status(200).json({ "token": row.token, "name": data["server-name"] })
        } else {
            return res.status(401).json({ "error": "user_pass" })
        }
    }
);
});


const server = api.listen(data["http-server"].port, () => {
    console.log("[Web Server] Ready")
});