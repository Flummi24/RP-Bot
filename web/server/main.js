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


const login = require("./routes/login.js")
login(api)

const user = require("./routes/user.js")
user(api)



const server = api.listen(data["http-server"].port, () => {
    console.log("[Web Server] Ready")
});