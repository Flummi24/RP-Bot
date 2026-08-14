const { REST, Routes } = require("discord.js");
require("dotenv").config({
    path: "../data/.env"
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const rest = new REST({ version: "10" }).setToken(TOKEN);

async function deployCommands(commands) {
try {
  await rest.put(
  Routes.applicationCommands(CLIENT_ID),
  { body: commands }
)
} catch (err) {
    throw new Error(`Fehler beim Deploy von den Slash Commands! Error: ${err}`)
}
}

module.exports = deployCommands