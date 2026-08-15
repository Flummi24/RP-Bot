const { generate } = require("./functions.js")
const check = require("../../utils/permissions.js")

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
                }
            }

        } catch (err) {
            return console.log(`[Ausweis] Fehler: ${err}`)
        }
    });
}