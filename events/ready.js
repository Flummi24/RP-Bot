const data = require("../data/data.json")

module.exports = (client) => {
    client.once('clientReady', async () => {
  console.log(`Eingeloggt als ${client.user.tag}`);

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