const db = require("../../../utils/database.js")
const path = require("path")


module.exports = async (api) => {
    api.get("/api/backup", async (req, res) => {
        const auth = req.query.auth;

        if (!auth) {
            return res.status(401).json({
                error: "auth"
            });
        }

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

        res.sendFile(path.join(__dirname, "../../../data/data.db"));
}
);
})
}