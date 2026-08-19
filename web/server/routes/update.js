const db = require("../../../utils/database.js")
const update = require("../../../utils/update.js")

module.exports = async (api) => {
    api.post("/api/update", async (req, res) => {
        const { auth } = req.body;

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

        res.status(200).json({ "sucess": true })
        console.log(`[UPDATE] Gestartet von Admin: ${row.username}`)

        await update()
}
);
})
}