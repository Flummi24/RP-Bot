const data = require("../data/data.json")
const builder = require("../commands/builder.js")
const deploy = require("../utils/deploy.js")
const update = require("../features/online-list/main.js")

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

  if (data.features["online-list"].enabled) {
    console.log("[Online Liste] Loading")
  setInterval(async () => {
    update()
  }, 1 * 60 * 1000);
    console.log("[Online Liste] Ready")
    update()

}


});
};