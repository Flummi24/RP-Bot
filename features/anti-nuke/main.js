const data = require("../../data/data.json")

const { AuditLogEvent } = require("discord.js")

module.exports = (client) => {
    client.on('guildMemberAdd', async (member) => {
    if (!member.user.bot) return;

    await member.ban({
        reason: 'Anti Nuke'
    });
    
    if (data.logging.enabled === true && data.logging["anti-nuke"]) {
        if (data.discord["use-container"]) {
            return;
        } else {

        }
    }

    const logs = await member.guild.fetchAuditLogs({
        type: 28,
        limit: 1
    })

    const entry = logs.entries.first();
   

    if (!entry) return;

    const inviter = entry.executor;

    console.log(
        `${inviter.tag} hat den Bot ${member.user.tag} eingeladen`
    );


try {

    // Optional: Einlader bannen
    const inviterMember = await member.guild.members.fetch(inviter.id);

    await inviterMember.ban({
        reason: 'Sicherheitsban'
    });
       console.log(`ANTI NUKE: Der User ${inviter.tag} wurde Gebannt`)

} catch (error) {
console.log(error.message)
}
});
};