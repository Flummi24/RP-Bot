require("../../../utils/database.js")

module.exports = async (api) => {
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
}