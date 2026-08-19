const { generate, create, remove, edit, hat, getall } = require("./functions.js")
const check = require("../../utils/permissions.js")
const roblox = require("../../utils/rblx.js")
const output = require("../../utils/output.js")

module.exports = async (client) => {
    console.log("[Ausweis] Loading")
    client.on('interactionCreate', async interaction => {
        try {
            if (!interaction.isChatInputCommand()) return;
            if (interaction.commandName === 'personalausweis') {
                const subcommand = interaction.options.getSubcommand();

                if (subcommand === 'get') {
                    const username = interaction.options.getString('username').toLowerCase();
                    const data = await generate(username)
                    if (data) {
                        return interaction.reply(data)
                    } else {
                        return interaction.reply("Fehler!")
                    }
                }
                
                if (subcommand === 'create') {
                    const check1 = await check(interaction.member)
                     if (check1) {
                        return interaction.reply(check1)
                    }

                    const username = interaction.options.getString('username').toLowerCase();
                    const name = interaction.options.getString('name')
                    const geburt = interaction.options.getString('geburtsdatum')

                    const hat_perso = await hat(username);

                    if (hat_perso) {
                        return interaction.reply("Dieser User hat bereits einen Personalausweis");
                    }
                    
                    const ok = await roblox(username)
                    if (!ok) {
                        return interaction.reply("Roblox Username nicht gefunden!")
                    }

                    const sucess = await create(username, name, geburt)
                    if(!sucess) {
                        return interaction.reply("Fehler bei der Erstellung vom Personalasuweis!")
                    }

                    return interaction.reply(output("Personalausweis Erstellt", `**Username**: ${username}\n**Name**: ${name}\n**Geburtsdatum**: ${geburt}`, 'Green'))
                    
                }

                if (subcommand === 'delete') {
                    const username = interaction.options.getString('username').toLowerCase();
                    const check1 = await check(interaction.member)
                     if (check1) {
                        return interaction.reply(check1)
                    }

                    const hat_perso = await hat(username)
                    if (!hat_perso) {
                        return interaction.reply("Dieser User hat kein Personalausweis")
                    }

                    const ok = await remove(username)
                    if (!ok) {
                        return interaction.reply("Fehler beim Löschen vom Personalausweis")
                    } else {
                        return interaction.reply("OK")
                    }
                }

                if (subcommand === 'edit') {
                    const username = interaction.options.getString("username").toLowerCase()
                    const feld = interaction.options.getString("feld")
                    const wert = interaction.options.getString("wert")
                    const check1 = await check(interaction.member)
                     if (check1) {
                        return interaction.reply(check1)
                    }

                    const hat_perso = await hat(username)
                    if (!hat_perso) {
                        return interaction.reply("Dieser User hat kein Personalausweis")
                    }

                    const sucess = edit(username, feld, wert)
                    if (!sucess) {
                        return interaction.reply("Fehler beim Bearbeiten vom Personalausweis")
                    } else {
                        return interaction.reply("OK")
                    }
                }
            }

if (interaction.commandName === 'führerschein') {
    const subcommand = interaction.options.getSubcommand();

    const ok = await check(interaction.member);

    if (ok) {
        return interaction.reply(ok);
    }

    const username = interaction.options.getString("username").toLowerCase();
    const typ = interaction.options.getString("typ");

    const hat_perso = await hat(username);

    if (!hat_perso) {
        return interaction.reply(
            "Dieser User hat keinen Personalausweis!"
        );
    }

    const führerscheine = {
        PKW: "pkw",
        LKW: "lkw",
        Motorrad: "motorrad"
    };

    if (subcommand === "add") {

        if (typ === "ALL") {
            await edit(username, "pkw", "true");
            await edit(username, "lkw", "true");
            await edit(username, "motorrad", "true");
        } else {
            const feld = führerscheine[typ];

            if (!feld) {
                return interaction.reply("Ungültiger Führerschein-Typ!");
            }

            const success = await edit(username, feld, "true");

            if (!success) {
                return interaction.reply(
                    "Fehler beim Vergeben des Führerscheins!"
                );
            }
        }

        return interaction.reply(
            output(
                "Führerschein vergeben",
                `**Username:** ${username}\n**Typ:** ${typ}`,
                "Green"
            )
        );
    }

    if (subcommand === "remove") {

        if (typ === "ALL") {
            await edit(username, "pkw", "false");
            await edit(username, "lkw", "false");
            await edit(username, "motorrad", "false");
        } else {
            const feld = führerscheine[typ];

            if (!feld) {
                return interaction.reply("Ungültiger Führerschein-Typ!");
            }

            const success = await edit(username, feld, "false");

            if (!success) {
                return interaction.reply(
                    "Fehler beim Entziehen des Führerscheins!"
                );
            }
        }

        return interaction.reply(
            output(
                "Führerschein entzogen",
                `**Username:** ${username}\n**Typ:** ${typ}`,
                "Red"
            )
        );
    }
}


if (interaction.commandName === "häuser") {

    const check1 = await check(interaction.member);

    if (check1) {
        return interaction.reply(check1);
    }

    const subcommand = interaction.options.getSubcommand();

    const username = interaction.options
        .getString("username")
        .toLowerCase();

    const haus = interaction.options
        .getString("haus")
        .trim();

    const hat_perso = await hat(username);

    if (!hat_perso) {
        return interaction.reply(
            "Dieser User hat keinen Personalausweis!"
        );
    }


    // =========================
    // HAUS HINZUFÜGEN
    // =========================

    if (subcommand === "add") {

        const row = await info(username);

        let haeuser;

        try {
            haeuser = JSON.parse(row.haeuser || "[]");
        } catch {
            haeuser = [];
        }

        if (haeuser.includes(haus)) {
            return interaction.reply(
                `**${haus}** gehört diesem User bereits!`
            );
        }

        const rows = await getall();

        for (const user of rows) {

            let userHaeuser;

            try {
                userHaeuser = JSON.parse(user.haeuser || "[]");
            } catch {
                userHaeuser = [];
            }

            if (userHaeuser.includes(haus)) {
                return interaction.reply(
                    `Das Haus **${haus}** gehört bereits <@${user.discord_id || user.username}>!`
                );
            }
        }

        haeuser.push(haus);

        const success = await edit(
            username,
            "haeuser",
            JSON.stringify(haeuser)
        );

        if (!success) {
            return interaction.reply(
                "Fehler beim Hinzufügen des Hauses!"
            );
        }

        return interaction.reply(
            `Das Haus **${haus}** wurde **${username}** hinzugefügt.`
        );
    }



    if (subcommand === "remove") {

        const row = await info(username);

        let haeuser;

        try {
            haeuser = JSON.parse(row.haeuser || "[]");
        } catch {
            haeuser = [];
        }

        if (!haeuser.includes(haus)) {
            return interaction.reply(
                `**${haus}** gehört diesem User nicht!`
            );
        }

        haeuser = haeuser.filter(h => h !== haus);

        const success = await edit(
            username,
            "haeuser",
            JSON.stringify(haeuser)
        );

        if (!success) {
            return interaction.reply(
                "Fehler beim Entfernen vom Haus"
            );
        }

        return interaction.reply(
            `Das Haus **${haus}** wurde von **${username}** entfernt`
        );
    }
}


        } catch (err) {
            return console.log(`[Ausweis] Fehler: ${err}`)
        }
    });
    console.log("[Ausweis] Ready")
}