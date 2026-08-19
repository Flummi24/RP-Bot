const { SlashCommandBuilder } = require("discord.js");
const data = require("../data/data.json")

const commands = [];

if (data.features.utils.enabled) {
    commands.push(
        new SlashCommandBuilder()
  .setName("say")
  .setDescription("Sende die Nachricht von einen Bot")
  .addStringOption(option =>
    option
      .setName("message")
      .setDescription("Die Nachricht")
      .setRequired(true),
 ),

        new SlashCommandBuilder()
   .setName('embed')
   .setDescription('Ein Embed senden')
   .addStringOption(option =>
      option
        .setName('farbe')
        .setDescription('farbe (HEXADEXIMAL)')
        .setRequired(true)
    )
   .addStringOption(option =>
      option
        .setName('titel')
        .setDescription('Titel')
        .setRequired(true)
    )
   .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Die Message')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('thumbnail')
        .setDescription('ein Bild klein Oben Rechts')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('bild')
        .setDescription('ein Bild groß unter dem Text')
        .setRequired(false)
    ),

    new SlashCommandBuilder()
   .setName('container')
   .setDescription('Container send')
   .addStringOption(option =>
      option
        .setName('titel')
        .setDescription('Titel')
        .setRequired(true)
    )
   .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Die Message')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('bild')
        .setDescription('ein Bild groß unter dem Text')
        .setRequired(false)
    )

    );
}

if (data.features.personal.enabled) {
    commands.push(
        new SlashCommandBuilder()
    .setName('personalausweis')
    .setDescription('Personalausweis Funktionen')
    
    // Edit
    .addSubcommand(subcommand =>
      subcommand
        .setName('edit')
        .setDescription('Editiere einen Personalausweis')
        .addStringOption(option =>
          option.setName('username')
            .setDescription('Der Ingame @Name')
            .setRequired(true))

        .addStringOption(option =>
          option.setName('feld')
            .setDescription('Selbst Erklärend')
            .setRequired(true)
            .addChoices(
                        { name: 'Name', value: 'name' },
                        { name: 'Geburtsdatum', value: 'geburt' }
                    )
                )
        .addStringOption(option =>
          option.setName('wert')
            .setDescription('Der Neue Wert vom Feld')
            .setRequired(true))
    )


    // CREATE
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Erstellt einen Personalausweis')
        .addStringOption(option =>
          option.setName('username')
            .setDescription('Der Ingame @Name')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('name')
            .setDescription('Beispiel: Max Musterman oder Flummi. WICHTIG: NICHT deinen Echten Namen verwenden')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('geburtsdatum')
            .setDescription('Geburtsdatum (TT.MM.JJJJ) WICHTIG: NICHT dein Echtes Geburtsdatum verwenden')
            .setRequired(true))
    )

    // GET
    .addSubcommand(subcommand =>
      subcommand
        .setName('get')
        .setDescription('Zeigt einen Personalausweis')
        .addStringOption(option =>
          option.setName('username')
            .setDescription('Der Ingane @Name')
            .setRequired(true))
    )

    // DELETE
    .addSubcommand(subcommand =>
      subcommand
        .setName('delete')
        .setDescription('Lösche einen Personalausweis')
        .addStringOption(option =>
          option.setName('username')
            .setDescription('Der Ingane @Name')
            .setRequired(true))
    ),

    new SlashCommandBuilder()
  .setName('führerschein')
  .setDescription('Führerschein Verwaltung')

  .addSubcommand(sub =>
    sub
      .setName('add')
      .setDescription('Führerschein hinzufügen')
      .addStringOption(option =>
        option
          .setName('username')
          .setDescription('Der Ingame @Name')
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName('typ')
          .setDescription('Führerschein Typ')
          .setRequired(true)
          .addChoices(
            { name: 'PKW', value: 'PKW' },
            { name: 'LKW', value: 'LKW' },
            { name: 'Motorrad', value: 'Motorrad' },
            { name: 'ALL', value: 'ALL' }
          )
      )
  )
  .addSubcommand(sub =>
    sub
      .setName('remove')
      .setDescription('Führerschein entfernen')
      .addStringOption(option =>
        option
          .setName('username')
          .setDescription('Der Ingame @Name')
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName('typ')
          .setDescription('Führerschein Typ')
          .setRequired(true)
          .addChoices(
            { name: 'PKW', value: 'PKW' },
            { name: 'LKW', value: 'LKW' },
            { name: 'Motorrad', value: 'Motorrad' },
            { name: 'ALL', value: 'ALL' }
          )
      )
  ),


    )
}

if (data.features.teamwarns.enabled) {
    commands.push(
    new SlashCommandBuilder()
    .setName('teamwarn')
    .setDescription('Verwaltet Teamwarns')
    .addSubcommand(sub =>
      sub
        .setName('add')
        .setDescription('Fügt ein Teamwarn hinzu')
        .addUserOption(option =>
          option.setName('user').setDescription('Der User').setRequired(true)
        )
        .addStringOption(option =>
          option.setName('grund').setDescription('Grund').setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('list')
        .setDescription('Zeigt alle Warnungen eines Users')
        .addUserOption(option =>
          option.setName('user').setDescription('Der User').setRequired(true)
        )
    )
   .addSubcommand(sub =>
  sub
    .setName('remove')
    .setDescription('Löscht eine bestimmte Warnung')
    .addUserOption(option =>
      option.setName('user').setDescription('Der User').setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('id').setDescription('Warn ID').setRequired(true)
    )
    .addStringOption(option =>
          option.setName('grund').setDescription('Grund der Entfernung').setRequired(true)
    )
)
    )

}

if (data.features["online-list"].enabled) {
  commands.push(
    new SlashCommandBuilder()
      .setName('setgameid')
     .setDescription('Setze die Game ID für die Online Liste')
     .addStringOption(option =>
					option
						.setName('username')
						.setDescription('Dein IC Username')
						.setRequired(true)
       )
  )
}

module.exports = commands.map(command => command.toJSON());;