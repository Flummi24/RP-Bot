const express = require("express")
const path = require("path")
const data = require("../../data/data.json")
const db = require("../../utils/database.js")

console.log("[Web Server] Loading")

const api = express();
api.use(express.json());
api.use(express.static(path.join(__dirname, "../src")));


const login = require("./routes/login.js")
login(api)

const user = require("./routes/user.js")
user(api)

const update = require("./routes/update.js")
update(api)

const backup = require("./routes/backup.js")
backup(api)


const server = api.listen(data["http-server"].port, () => {
    console.log("[Web Server] Ready")
});