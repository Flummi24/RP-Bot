require("./utils/preload.js")
require("dotenv").config({
    path: "../data/.env"
});

const client = require("./init/client.js")

const anti_nuke = require("./features/anti-nuke/main.js")
anti_nuke(client)

const TOKEN = process.env.TOKEN;
client.login(TOKEN)