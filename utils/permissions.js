const data = require("../data/data.json")

async function check(member) {
    if (!member.roles.cache.has(data["admin-role"])) {
            return { content: `Dir fehlen die folgenden Rechte: <@&${data["admin-role"]}>`, ephemeral: true };
    } else {
        return false
    }
}

module.exports = check