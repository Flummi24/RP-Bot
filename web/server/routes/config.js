const db = require("../../../utils/database.js")

module.exports = async (api) => {
    api.get("/api/config/get", async (req, res) => {
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

        res.status(200).send(require("../../../data/data.json"))
}
);
});
}