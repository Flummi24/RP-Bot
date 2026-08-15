const db = require("../../../utils/database.js")
const crypto = require("crypto")

module.exports = async (api) => {
    api.post("/api/user/add", async (req, res) => {
    const { username, password, auth } = req.body;

    const token = crypto.randomBytes(128).toString("hex");

    await db.get(
    "SELECT * FROM users WHERE token = ?",
    [auth],
    async (err, row) => {
        if (err) {
            return res.status(500).json({ "error": "500" })
        }
        if (!row) {
            return res.status(401).json({ "error": "auth" })
        }

        await db.run(
    "INSERT INTO users (username, password, token) VALUES (?, ?, ?)",
    [username, password, token],
    (err) => {
        if (err) {
            return res.status(500).json({ "error": "500" })
        } else { 
            return res.status(200).json({ "success": true })
        }
        
    }
);
}
);
});


api.post("/api/user/remove", async (req, res) => {
    const { username, auth } = req.body;

    await db.get(
    "SELECT * FROM users WHERE token = ?",
    [auth],
    async (err, row) => {
        if (err) {
            return res.status(500).json({ "error": "500" })
        }
        if (!row) {
            return res.status(401).json({ "error": "auth" })
        }

        await db.run(
    "DELETE FROM users WHERE username = ?",
    [username],
    (err) => {
        if (err) {
            return res.status(500).json({ "error": "500" })
        } else { 
            return res.status(200).json({ "success": true })
        }
        
    }
);
}
);
});

api.post("/api/user/update", async (req, res) => {
    const { username, password, auth } = req.body;

    await db.get(
    "SELECT * FROM users WHERE token = ?",
    [auth],
    async (err, row) => {
        if (err) {
            return res.status(500).json({ "error": "500" })
        }
        if (!row) {
            return res.status(401).json({ "error": "auth" })
        }

        await db.run(
    "UPDATE users SET password = ? WHERE username = ?",
    [password, username],
    (err) => {
        if (err) {
            return res.status(500).json({ "error": "500" })
        } else { 
            return res.status(200).json({ "success": true })
        }
        
    }
);
}
);
});

api.get("/api/user/get", async (req, res) => {
    const auth = req.query.auth;

    await db.get(
    "SELECT * FROM users WHERE token = ?",
    [auth],
    async (err, row) => {
        if (err) {
            return res.status(500).json({ "error": "500" })
        }
        if (!row) {
            return res.status(401).json({ "error": "auth" })
        }

        await db.all(
    "SELECT username FROM users",
    async (err, rows) => {
        if (err) {
            return res.status(500).json({ "error": "500" })
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: "no_user" });
        }

        return res.status(200).json({ "res": rows })
    }
);
}
);
});

}