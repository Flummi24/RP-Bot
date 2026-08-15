require("./utils/preload.js")
require("dotenv").config({
    path: "../data/.env"
});
const data = require("./data/data.json")

const client = require("./init/client.js")

if (data.features["anti-nuke"].enabled) {
const anti_nuke = require("./features/anti-nuke/main.js")
anti_nuke(client)
}

if (data.features["teamwarns"].enabled) {
const teamwarns = require("./features/teamwarns/main.js")
teamwarns(client)
}

if (data.features.utils.enabled) {
const utils = require("./features/messages/main.js")
utils(client)
}

const TOKEN = process.env.TOKEN;
client.login(TOKEN)