const data = require("../data/data.json")

async function check(member) {
    const roles = await member.roles.fetch();
    if (!roles.has(data["admin-role"])) {
            return { content: `Dir fehlen die folgenden Rechte: <@${data["admin-role"]}>`, ephemeral: true };
    } else {
        return false
    }
}

module.exports = check