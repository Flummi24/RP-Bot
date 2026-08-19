const data = require("../../data/data.json")
const { EmbedBuilder } = require("discord.js")

module.exports = (client) => {
client.on("messageDelete", async (message) => {
    if (message.author.bot) return;

    const channel = await client.channels.fetch(data.logging["channel-id"]);

const embed = new EmbedBuilder()
      .setTitle('Nachricht Gelöscht')
      .setColor('Yellow')
      .setDescription(`\n**User**: <@${message.author.id}> \n**Kanal**: <#${message.channel.id}> \n\n**Nachricht**: ${message.content || "Keine Nachricht"}\n\n **Nachrichten Link:** ${message.url}\n`)
      .setTimestamp();

await channel.send({ embeds: [embed] });
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
  if (oldMessage.author.bot) return;
  if (newMessage.author.bot) return;
  const channel = await client.channels.fetch(data.logging["channel-id"]);

const embed = new EmbedBuilder()
      .setTitle('Nachricht Bearbeitet')
      .setColor('Yellow')
      .setDescription(`\n**User**: <@${newMessage.author.id}> \n**Kanal**: <#${newMessage.channel.id}> \n\n**Alte Nachricht**: ${oldMessage.content} \n**Neue Nachricht**: ${newMessage.content}\n\n **Nachrichten Link:** ${newMessage.url}\n`)
      .setTimestamp();

await channel.send({ embeds: [embed] });
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const message_1 = message.content.toLowerCase();
  const channel = await client.channels.fetch(data.logging["channel-id"]);

 let attachmentText = "";

  if (message.attachments.size > 0) {
    message.attachments.forEach(att => {
      attachmentText += `[${att.name}](${att.url})\n`;
    });
  } else {
    attachmentText = "Keine";
  }

  const embed = new EmbedBuilder()
    .setTitle('Nachrichten Gesendet')
    .setColor('Yellow')
    .setDescription(
`**User**: <@${message.author.id}>
**Kanal**: <#${message.channel.id}>

**Nachricht**:
${message.content || "Keine"}

**Anhänge**:
${attachmentText}

**Nachrichten Link:** ${message.url}`
    )
    .setTimestamp();

  const firstAttachment = message.attachments.first();
  if (firstAttachment?.contentType?.startsWith("image/")) {
    embed.setImage(firstAttachment.url);
  }

  await channel.send({ embeds: [embed] });    

});

}