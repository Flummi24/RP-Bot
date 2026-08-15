const { ebuilder, cbuilder } = require("./builders.js")
const data = require("../data/data.json")

async function output(title, content, color) {
    if (data.discord["use-container"]) {
        return { flags: 1 << 15, components: cbuilder(title, content) }
    } else {
        return { embeds: [ebuilder(title, content, color)] }
    }
}

module.exports = output