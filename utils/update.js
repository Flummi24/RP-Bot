const fs = require("fs/promises");
const fsSync = require("fs");
const https = require("https");
const unzipper = require("unzipper");
const path = require("path");

function download(url, destination) {
    return new Promise((resolve, reject) => {
        https.get(url, response => {

            // GitHub Redirect
            if (
                response.statusCode >= 300 &&
                response.statusCode < 400 &&
                response.headers.location
            ) {
                response.resume();

                return download(
                    response.headers.location,
                    destination
                )
                    .then(resolve)
                    .catch(reject);
            }

            if (response.statusCode !== 200) {
                response.resume();
                return reject(
                    new Error(`HTTP ${response.statusCode}`)
                );
            }

            const file = fsSync.createWriteStream(destination);

            response.pipe(file);

            file.on("finish", () => {
                file.close(resolve);
            });

            file.on("error", err => {
                file.destroy();
                reject(err);
            });

            response.on("error", err => {
                file.destroy();
                reject(err);
            });
        }).on("error", reject);
    });
}

module.exports = async () => {
    try {
        console.log("[UPDATE] Lade Update herunter");

        const root = path.join(__dirname, "..");

        const zipPath = path.join(root, "update.zip");
        const tempPath = path.join(root, "update");

        await download(
            "https://github.com/Flummi24/RP-Bot/archive/refs/heads/main.zip",
            zipPath
        );

        console.log("[UPDATE] Download Fertig");

        await fs.rm(tempPath, {
            recursive: true,
            force: true
        });

        console.log("[UPDATE] Entpacke Update");

        await fsSync
            .createReadStream(zipPath)
            .pipe(
                unzipper.Extract({
                    path: tempPath
                })
            )
            .promise();

        console.log("[UPDATE] Update Entpackt");

        const source = path.join(
            tempPath,
            "RP-Bot-main"
        );

        async function copyFolder(sourceDir, targetDir) {
            const entries = await fs.readdir(sourceDir, {
                withFileTypes: true
            });

            await fs.mkdir(targetDir, {
                recursive: true
            });

            for (const entry of entries) {

                // data niemals überschreiben
                if (entry.name === "data") {
                    continue;
                }

                const sourcePath = path.join(
                    sourceDir,
                    entry.name
                );

                const targetPath = path.join(
                    targetDir,
                    entry.name
                );

                if (entry.isDirectory()) {
                    await copyFolder(
                        sourcePath,
                        targetPath
                    );
                } else {
                    await fs.copyFile(
                        sourcePath,
                        targetPath
                    );
                }
            }
        }

        await copyFolder(source, root);

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
        console.error("[UPDATE] Fehler:", err);

        return false;
    }
};