const fs = require("fs/promises")
const restore = require("./data.json")
const reset = require("./reset-db.js")

module.exports = (async () => {
    console.log("[Startup] Preloading")
   try {
    try {
        const stat = await fs.stat("../data");

        if (!stat.isDirectory()) {
            throw new Error("/data ist kein Ordner");
        }
    } catch (err) {
        if (err.code === "ENOENT") {
            console.log("[Preload] Creating /data");

            await fs.mkdir("../data", { recursive: true });

            await fs.writeFile(
                "../data/.env",
                "TOKEN=MTX\nCLIENT_ID=123456789"
            );

            await fs.writeFile(
                "../data/data.json",
                JSON.stringify(restore, null, 4)
            );

            await reset()
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
        const local = require("../version.json");

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
    }

    console.log("[Startup] Preloading Fertig")
})();