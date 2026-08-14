const db = require("./utils/database.js")

db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    ["admin", "admin"],
    function (err) {
        console.log(this.lastID);
    }
);