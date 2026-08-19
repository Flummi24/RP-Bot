const preload = require("./utils/preload.js");

(async () => {
    await preload()

require("dotenv").config({
    path: "./data/.env"
});

const client = require("./init/client.js")

const ready = require("./events/ready.js")
ready(client)

const commands = require("./commands/builder.js")
const deploy = require("./utils/deploy.js")
deploy(commands)

const data = require("./data/data.json");

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

if (data.features["online-list"].enabled) {
    const online = require("./features/online-list/interactions.js")
    online(client)
}

if (data.features.personal.enabled) {
    const personal = require("./features/personal/main.js")
    personal(client)
}


if (data["http-server"].enabled) {
    const web = require("./web/server/main.js")
    
}

const TOKEN = process.env.TOKEN;
client.login(TOKEN)

})()