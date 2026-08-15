const data = require("../data/data.json")
const builder = require("../commands/builder.js")
const deploy = require("../utils/deploy.js")

module.exports = (client) => {
    client.once('clientReady', async () => {
  console.log(`Bot Gestartet als ${client.user.tag}`);

client.user.setPresence({
    activities: [
      {
        name: data.discord.status,
        type: 0
      }
    ],
    status: 'online'
  });


});
};