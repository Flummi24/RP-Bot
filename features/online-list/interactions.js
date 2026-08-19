const fs = require("fs/promises");
const path = require("path");

const dataPath = path.join(__dirname, "../../data/data.json");
const data = require(dataPath);
const check = require("../../utils/permissions.js");

async function userToId(username) {
    try {
        const res = await fetch(
            "https://users.roblox.com/v1/usernames/users",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    usernames: [username]
                })
            }
        );

        const result = await res.json();

        if (!result.data || result.data.length === 0) {
            return null;
        }

        return result.data[0].id;

    } catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = async (client) => {

    client.on("interactionCreate", async interaction => {
        try {
            if (!interaction.isChatInputCommand()) return;
            if (interaction.commandName !== "setgameid") return;

            const check1 = await check(interaction.member);

            if (check1) {
                return interaction.reply(check1);
            }

            const username = interaction.options.getString("username");
            const userid = await userToId(username);

            if (!userid) {
                return interaction.reply("Roblox-Benutzer nicht gefunden.");
            }

            const response = await fetch(
                "https://presence.roblox.com/v1/presence/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Cookie": data.features["online-list"]["cookie"]
                    },
                    body: JSON.stringify({
                        userIds: [userid]
                    })
                }
            );

            const presenceData = await response.json();
            const presence = presenceData.userPresences?.[0];

            if (!presence) {
                return interaction.reply("Keine Presence gefunden.");
            }

            if (
                presence.userPresenceType === 2 &&
                presence.placeId === 7711635737
            ) {
                data.features["online-list"]["game-id"] = presence.gameId;
                await fs.writeFile(
                    dataPath,
                    JSON.stringify(data, null, 4),
                    "utf8"
                );

                return interaction.reply("OK");
            }

            return interaction.reply("Fehler");

        } catch (err) {
            console.error("[ONLINE Liste] Fehler:", err);
        }
    });
};