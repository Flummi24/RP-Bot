const { ebuilder, cbuilder } = require("./builders.js")
const data = require("../data/data.json")

async function output(title, content, color) {
    if (data.discord["use-container"]) {
        return cbuilder(title, content)
    } else {
        return ebuilder(title, content, color)
    }
}

module.exports = output