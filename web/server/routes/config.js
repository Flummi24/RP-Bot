const db = require("../../../utils/database.js")
const fs = require("fs");
const fs1 = require("fs/promises")
const path = require("path");

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

        const configPath = path.join(
    __dirname,
    "../../../data/data.json"
);

const config = JSON.parse(
    await fs1.readFile(configPath, "utf8")
);

res.status(200).json(config);
}
);
});

api.post("/api/config/set", async (req, res) => {

        const {
            auth,
            key,
            value
        } = req.body;

        // Auth prüfen
        if (!auth) {
            return res.status(401).json({
                error: "auth"
            });
        }

        // Key prüfen
        if (!key) {
            return res.status(400).json({
                error: "key"
            });
        }

        // User anhand des Tokens suchen
        db.get(
            "SELECT * FROM users WHERE token = ?",
            [auth],
            async (err, row) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        error: "500"
                    });
                }

                if (!row) {
                    return res.status(401).json({
                        error: "auth"
                    });
                }

                try {

                    /*
                     * data.json laden
                     */
                    const configPath = path.join(
                        __dirname,
                        "../../../data/data.json"
                    );

                    const config = JSON.parse(
                        fs.readFileSync(
                            configPath,
                            "utf8"
                        )
                    );


                    /*
                     * Key aufteilen
                     *
                     * z.B.
                     *
                     * features.anti-nuke.enabled
                     *
                     * =>
                     *
                     * [
                     *   "features",
                     *   "anti-nuke",
                     *   "enabled"
                     * ]
                     */
                    const parts = key.split(".");


                    /*
                     * Zum richtigen Objekt gehen
                     */
                    let target = config;

                    for (let i = 0; i < parts.length - 1; i++) {

                        if (
                            typeof target[parts[i]] !== "object" ||
                            target[parts[i]] === null
                        ) {

                            return res.status(400).json({
                                error: "Ungültiger Config-Key"
                            });
                        }

                        target = target[parts[i]];
                    }


                    /*
                     * Letzten Key setzen
                     */
                    const lastKey = parts[parts.length - 1];

                    target[lastKey] = value;


                    /*
                     * JSON speichern
                     */
                    fs.writeFileSync(
                        configPath,
                        JSON.stringify(config, null, 2),
                        "utf8"
                    );


                    /*
                     * Antwort
                     */
                    return res.status(200).json({
                        success: true,
                        key: key,
                        value: value
                    });

                } catch (error) {

                    console.error(error);

                    return res.status(500).json({
                        error: "Config konnte nicht gespeichert werden"
                    });
                }
            }
        );
    });

}