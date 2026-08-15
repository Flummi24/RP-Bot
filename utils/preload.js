module.exports = (async () => {
    console.log("[Startup] Preloading")
    try {
        const res = await fetch(
            "https://raw.githubusercontent.com/Flummi24/RP-Bot/main/version.json"
        );

        const data = await res.json();
        const local = require("./version.json");

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