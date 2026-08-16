// /container /embed /say etc

const data = require("../../data/data.json")
const check = require("../../utils/permissions.js")

module.exports = async (client) => {
    console.log("[Utils] Loading")
    client.on('interactionCreate', async interaction => {
        try {
       if (!interaction.isChatInputCommand()) return;

       if (interaction.commandName === 'say') {
        const message = interaction.options.getString("message")
        const check1 = await check(interaction.member)
        if (check1) {
            return interaction.reply(check1)
        }

        interaction.channel.send(message)
        return interaction.reply({ content: "OK", ephemeral: true })
       } // Say handler Ende

       if (interaction.commandName === 'embed') {
        const check1 = await check(interaction.member)
        if (check1) {
            return interaction.reply(check1)
        }
        try {
   const farbe = interaction.options.getString('farbe');
   const titel = interaction.options.getString('titel');
   const message = interaction.options.getString('message');
   const bild = interaction.options.getString('bild');
   const thumbnail = interaction.options.getString('thumbnail');

 const embed = new EmbedBuilder()
      .setTitle(titel)
      .setColor(farbe)
      .setDescription(message.replace(/\\n/g, '\n'))
      .setThumbnail(thumbnail)
      .setImage(bild)
      .setTimestamp();

   interaction.channel.send({ embeds: [embed] })
   return interaction.reply({ content: "OK", ephemeral: true })
        } catch (err) {
            return interaction.reply("Error bei der Antwort: " + err)
        }
       } // Embed Handler Ende

    if (interaction.commandName === 'container') {
        const check1 = await check(interaction.member)
        if (check1) {
            return interaction.reply(check1)
        }
        const titel = interaction.options.getString('titel');
const message = interaction.options.getString('message');
const bild = interaction.options.getString('bild');


const container = new ContainerBuilder()
  .addTextDisplayComponents(
    new TextDisplayBuilder()
      .setContent(`# ${titel}`)
  )
  .addTextDisplayComponents(
    new TextDisplayBuilder()
      .setContent(message.replace(/\\n/g, '\n'))
  );

if (bild) {
  container.addMediaGalleryComponents(
    new MediaGalleryBuilder().addItems(item =>
      item.setURL(bild)
    )
  );
}

await interaction.channel.send({
  flags: 1 << 15,
  components: [container]
});

return interaction.reply({ content: "OK", ephemeral: true })

    } // Container handler Ende

    } catch (err) {
        return console.log(`[Utils] Error: ${err}`)
    }
    });
    console.log("[Utils] Ready")
}