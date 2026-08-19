const { generate, create, remove, edit, hat } = require("./functions.js")
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
                    const geburt = interaction.options.getString('geburt')

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

                if (subcommand === 'remove') {
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

        } catch (err) {
            return console.log(`[Ausweis] Fehler: ${err}`)
        }
    });
    console.log("[Ausweis] Ready")
}