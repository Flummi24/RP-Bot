const db = require("./utils/database.js")

const crypto = require("crypto");

/*

db.run(`CREATE TABLE IF NOT EXISTS users (
                    username TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    token TEXT NOT NULL
)
                `)

*/

const token = crypto.randomBytes(64).toString("hex");

db.run(
    "INSERT INTO users (username, password, token) VALUES (?, ?, ?)",
    ["admin", "admin", token],
    (err) => {
        if (err) {
            console.log(err.message);
        }
    }
);