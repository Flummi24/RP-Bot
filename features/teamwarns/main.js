const db = require("../../utils/database.js")
const data = require("../../data/data.json")
const output = require("../../utils/output.js")

db.run(`
    CREATE TABLE IF NOT EXISTS tw (
        user TEXT,
        reason TEXT,
        von TEXT,
        datum TEXT
    )
`);

module.exports = async (client) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === 'teamwarn') {
             const subcommand = interaction.options.getSubcommand();
             const user = interaction.options.getMember('user');

             if (!interaction.member.roles.cache.has(data["admin-role"])) {
                 return interaction.reply({ content: `Dir fehlen die folgenden Rechte: ${data["admin-role"]}`, ephemeral: true });
             }

             if (subcommand === 'add') {
                const grund = interaction.options.getString('grund');
                const datum = new Date().toLocaleTimeString("de-DE");

                db.run(`
                        INSERT INTO tw (user, reason, von, datum)
                        VALUES (?, ?, ?, ?)
                    `, [user.id, grund, interaction.user.id, datum]);

                    const message = await output("Teamwarn", `**User**: <@${user.id}>\n**Grund**: ${grund}\n**Von**: <@${interaction.user.id}>\n**Datum**: ${datum}`, "Red")
                    return interaction.reply(message)
            }
        }

    });
}