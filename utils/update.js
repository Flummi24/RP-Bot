const fs = require("fs/promises");
const fsSync = require("fs");
const https = require("https");
const unzipper = require("unzipper");
const path = require("path");

module.exports = async () => {
    try {
        console.log("[UPDATE] Lade Update herunter");

        // Projekt-Hauptverzeichnis
        const root = path.join(__dirname, "..");

        const zipPath = path.join(root, "update.zip");
        const tempPath = path.join(root, "update");

        // ZIP herunterladen
        await new Promise((resolve, reject) => {
            const file = fsSync.createWriteStream(zipPath);

            https.get(
                "https://github.com/Flummi24/RP-Bot/archive/refs/heads/main.zip",
                response => {
                    response.pipe(file);

                    file.on("finish", () => {
                        file.close();
                        resolve();
                    });

                    file.on("error", reject);
                }
            ).on("error", err => {
                file.close();
                reject(err);
            });
        });

        console.log("[UPDATE] Download Fertig");

        // Alten Update-Ordner löschen
        await fs.rm(tempPath, {
            recursive: true,
            force: true
        });

        // ZIP entpacken
        await fsSync
            .createReadStream(zipPath)
            .pipe(
                unzipper.Extract({
                    path: tempPath
                })
            )
            .promise();

        console.log("[UPDATE] Update Entpackt");

        // GitHub ZIP:
        // update/RP-Bot-main/
        const source = path.join(tempPath, "RP-Bot-main");

        async function copyFolder(sourceDir, targetDir) {
            const entries = await fs.readdir(sourceDir, {
                withFileTypes: true
            });

            await fs.mkdir(targetDir, {
                recursive: true
            });

            for (const entry of entries) {

                // data niemals anfassen
                if (entry.name === "data") {
                    continue;
                }

                const sourcePath = path.join(sourceDir, entry.name);
                const targetPath = path.join(targetDir, entry.name);

                if (entry.isDirectory()) {
                    await copyFolder(sourcePath, targetPath);
                } else {
                    await fs.copyFile(sourcePath, targetPath);
                }
            }
        }

        // Dateien ins Hauptverzeichnis kopieren
        await copyFolder(source, root);

        // Aufräumen
        await fs.rm(zipPath, {
            force: true
        });

        await fs.rm(tempPath, {
            recursive: true,
            force: true
        });

        console.log("[UPDATE] Update fertig!");

        return true;

    } catch (err) {
        console.log(`[UPDATE] Fehler: ${err}`);
        return false;
    }
};
