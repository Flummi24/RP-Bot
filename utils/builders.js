const { EmbedBuilder, ActionRowBuilder, ContainerBuilder, TextDisplayBuilder, MediaGalleryBuilder } = require("discord.js")
const data = require("../data/data.json")

async function container_builder(title, content) {
    const container = new ContainerBuilder()
  .addTextDisplayComponents(
    new TextDisplayBuilder()
      .setContent(`# ${title}`)
  )
  .addTextDisplayComponents(
    new TextDisplayBuilder()
      .setContent(content)
  )

  if (data.discord["use-footer"]) {
    container.addMediaGalleryComponents(
    new MediaGalleryBuilder().addItems(item =>
      item.setURL(data.discord["footer-url"])
    )
  )
  }

  return container
}

async function embed_builder(title, content, color) {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(color)
        .setDescription(content)
        .setTimestamp();

    if (data.discord["use-footer"]) {
    embed.setImage(data.discord["footer-url"])
  };

  return embed
}

module.exports = {
    'cbuilder': container_builder,
    'ebuilder': embed_builder
}