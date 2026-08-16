const fs = require("fs/promises");
const path = require("path");

const restore = require(path.join(__dirname, "./data.json"));
const reset = require(path.join(__dirname, "./reset-db.js"));

module.exports = (async () => {
    console.log("[Startup] Preloading");

    const dataDir = path.join(__dirname, "../data");
    const envFile = path.join(dataDir, ".env");
    const dataFile = path.join(dataDir, "data.json");
    const versionFile = path.join(__dirname, "../version.json");

    try {
        try {
            const stat = await fs.stat(dataDir);

            if (!stat.isDirectory()) {
                throw new Error("/data ist kein Ordner");
            }
        } catch (err) {
            if (err.code === "ENOENT") {
                console.log("[Preload] Creating /data");

                await fs.mkdir(dataDir, { recursive: true });

                await fs.writeFile(
                    envFile,
                    "TOKEN=MTX\nCLIENT_ID=123456789"
                );

                await fs.writeFile(
                    dataFile,
                    JSON.stringify(restore, null, 4)
                );

                await reset();
            } else {
                throw err;
            }
        }
    } catch (err) {
        console.log(`[Startup] Fehler: ${err}`);
    }

    try {
        const res = await fetch(
            "https://raw.githubusercontent.com/Flummi24/RP-Bot/main/version.json"
        );

        const data = await res.json();
        const local = require(versionFile);

        if (Number(local.value) < Number(data.value)) {
            console.log("=====================================================================");
            console.log("[UPDATE] Eine neue Version vom RP Bot ist verfügbar!");
            console.log("[UPDATE] Lade sie hier herunter: https://github.com/Flummi24/RP-Bot");
            console.log("[UPDATE] ODER");
            console.log("[UPDATE] Update den Bot über den Update Button auf dem Web Dashboard");
            console.log("=====================================================================");
        }
    } catch (err) {
        console.log("[UPDATE] Es ist ein Fehler bei der Überprüfung von Updates aufgetreten!");
        console.log(err);
    }

    console.log("[Startup] Preloading Fertig");
})();
