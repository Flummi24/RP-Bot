const data = require("../../data/data.json")
const output = require("../../utils/output.js")

const { AuditLogEvent } = require("discord.js")

module.exports = (client) => {
    client.on('guildMemberAdd', async (member) => {
    if (!member.user.bot) return;

    await member.ban({
        reason: 'Anti Nuke'
    });

    const logs = await member.guild.fetchAuditLogs({
        type: 28,
        limit: 1
    })

    const entry = logs.entries.first();
    if (!entry) return;
    const inviter = entry.executor;

    if (data.logging.enabled === true && data.logging["anti-nuke"]) {
        const channel = await client.channels.fetch(data.logging.channel);

        const message = output('Anti Nuke', `\n**User**: <@${inviter.id}>\n**Bot**: <@${member.id}>\n**Aktionen**: Ban`)

        channel.send({ embeds: [message] })
    }

try {

    const inviterMember = await member.guild.members.fetch(inviter.id);

    await inviterMember.ban({
        reason: 'Anti Nuke'
    });

} catch (error) {
console.log(error)
}

});

};