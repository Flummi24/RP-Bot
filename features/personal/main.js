const { generate, create } = require("./functions.js")
const check = require("../../utils/permissions.js")
const roblox = require("../../utils/rblx.js")
const output = require("../../utils/output.js")

module.exports = async (client) => {
    client.on('interactionCreate', async interaction => {
        try {
            if (!interaction.isChatInputCommand()) return;
            if (interaction.commandName === 'personalausweis') {
                const subcommand = interaction.options.getSubcommand();

                if (subcommand === 'get') {
                    const username = interaction.options.getString('username')
                    const data = await generate(username)
                    if (data) {
                        return interaction.reply(data)
                    } else {
                        return interaction.reply("Fehler!")
                    }
                }
                
                if (subcommand === 'create') {
                    const check1 = await check()
                     if (check1) {
                        return interaction.reply(check1)
                    }

                    const username = interaction.options.getString('username')
                    const name = interaction.options.getString('name')
                    const geburt = interaction.options.getString('geburt')
                    
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
            }

        } catch (err) {
            return console.log(`[Ausweis] Fehler: ${err}`)
        }
    });
}