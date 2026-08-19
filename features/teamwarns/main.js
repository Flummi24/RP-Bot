const db = require("../../utils/database.js")
const data = require("../../data/data.json")
const output = require("../../utils/output.js")
const check = require("../../utils/permissions.js")

module.exports = async (client) => {
    console.log("[Teamwarns] Loading")
    client.on('interactionCreate', async interaction => {
        try {
        if (!interaction.isChatInputCommand()) return;
        const ok = await check(interaction.member)
        if (ok) {
            return interaction.reply(ok)
        }

        if (interaction.commandName === 'teamwarn') {
             const subcommand = interaction.options.getSubcommand();
             const user = interaction.options.getMember('user');

             if (!interaction.member.roles.cache.has(data["admin-role"])) {
                 return interaction.reply({ content: `Dir fehlen die folgenden Rechte: ${data["admin-role"]}`, ephemeral: true });
             }

             if (subcommand === 'add') {
                const grund = interaction.options.getString('grund');
                const datum = new Date().toISOString();

                db.run(`
    INSERT INTO tw (user, reason, von, datum)
    VALUES (?, ?, ?, ?)
`, [user.id, grund, interaction.user.id, datum], async function (err) {

    if (err) {
        console.error("Fehler in der Datenbank:", err);

        return interaction.reply({
            content: "Fehler beim Erstellen der Teamwarnung!",
            ephemeral: true
        });
    }

    const message = await output("⚠️ Teamwarn", `**User**: <@${user.id}>\n**Grund**: ${grund}\n**Von**: <@${interaction.user.id}>\n**Datum**: ${new Date(datum).toLocaleString("de-DE")}`, "Red")
    return interaction.reply(message)

});
            } else if (subcommand === "list") {
    if (!user) {
        return interaction.reply({
            content: "User nicht gefunden!",
            ephemeral: true
        });
    }

    db.all(`
        SELECT id, reason, von, datum
        FROM tw
        WHERE user = ?
        ORDER BY id DESC
    `, [user.id], async (err, warns) => {

        if (err) {
            console.error("Fehler in der Datenbank:", err);

            return interaction.reply({
                content: "Fehler!",
                ephemeral: true
            });
        }

        if (!warns || warns.length === 0) {
            return interaction.reply({
                content: "Dieser User hat keine Teamwarns",
                ephemeral: true
            });
        }

        const description = warns.map(w =>
            `**Teamwarn #${w.id}**\n` +
            `**Grund:** ${w.reason}\n` +
            `**Von:** <@${w.von}>\n` +
            `**Datum:** ${new Date(w.datum).toLocaleString("de-DE")}`
        ).join("\n\n");

        const message = await output(`⚠️ Teamwarns von ${user.user.username}`, description, "Yellow");

        return interaction.reply(message);
    });
    } else if (subcommand === "remove") {

    const warnId = interaction.options.getInteger("id");
    const reason = interaction.options.getString("grund");

    if (!user) {
        return interaction.reply({
            content: "User nicht gefunden!",
            ephemeral: true
        });
    }

    db.get(
        `SELECT * FROM tw WHERE id = ? AND user = ?`,
        [warnId, user.id],
        (err, warn) => {

            if (err) {
            console.error("Fehler in der Datenbank:", err);

            return interaction.reply({
                content: "Fehler!",
                ephemeral: true
            });
        }

            if (!warn) {
                return interaction.reply({
                    content: "Ungültige Warn ID!",
                    ephemeral: true
                });
            }

            db.run(
                `DELETE FROM tw WHERE id = ?`,
                [warnId],
                async function (err) {

                    if (err) {
            console.error("Fehler in der Datenbank:", err);

            return interaction.reply({
                content: "Fehler!",
                ephemeral: true
            });
        }

        const message = await output("⚠️ Teamwarn entfernt", `**User**: <@${user.id}>\n**Gelöschte Warn ID**: ${warnId}\n**Warn Grund**: ${warn.reason}\n**Grund:** ${reason}`, "Yellow");
        return interaction.reply(message)
                }
            );
        }
    );
}
        }

    } catch (err) {
        console.log(`[Teamwarns] Error: ${err}`)
    }
    });

    console.log("[Teamwarns] Ready")
}