const data = require("../../data/data.json")
const GAME_ID = data.features["online-list"]["game-id"]
const output = require("../../utils/output.js")

async function update() {

const ingameAdmins = [];
const ohneAdmins = []
const robloxAdmins = [];
const unknownAdmins = [];

// Admins online mit Rechten

const response = await fetch(
    `https://groups.roblox.com/v1/groups/${data.features["online-list"]["group-id"]}/roles/${data.features["online-list"]["admin-role"]}/users?limit=100`,
    {
      method: "GET",
      headers: {
            "Content-Type": "application/json",
            "Cookie": cookie
     }
   }
);

const data = await response.json();

const ic_rechte_user = new Map(
    data.data.map(user => [
        user.userId,
        user.username
    ])
);



const response1 = await fetch(
    "https://presence.roblox.com/v1/presence/users",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookie
        },
        body: JSON.stringify({
            userIds: [...ic_rechte_user.keys()]
        })
    }
);

const data1 = await response1.json();


for (const presence of data1.userPresences) {
    if (
        presence.userPresenceType === 2 &&
        presence.placeId === TARGET_PLACE_ID &&
        presence.gameId === GAME_ID
    ) {
        ingameAdmins.push(ic_rechte_user.get(presence.userId));
    }
}


// Admins ohne ic Rechte


const response5 = await fetch(
    `https://groups.roblox.com/v1/groups/${data.features["online-list"]["group-id"]}/roles/${data.features["online-list"]["no_right_role"]}/users?limit=100`,
    {
      method: "GET",
      headers: {
            "Content-Type": "application/json",
            "Cookie": cookie
     }
   }
);

const data5 = await response5.json();

const user = new Map(
    data5.data.map(user => [
        user.userId,
        user.username
    ])
);


const response6 = await fetch(
    "https://presence.roblox.com/v1/presence/users",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookie
        },
        body: JSON.stringify({
            userIds: [...user.keys()]
        })
    }
);

const data6 = await response6.json();



for (const presence of data6.userPresences) {
    if (
        presence.userPresenceType === 2 &&
        presence.placeId === TARGET_PLACE_ID &&
        presence.gameId === GAME_ID
    ) {
        ohneAdmins.push(user.get(presence.userId));
    }
}



// Admins online auf Roblox


for (const presence of data6.userPresences) {
    if (
        presence.userPresenceType === 2 &&
        presence.placeId !== TARGET_PLACE_ID &&
        presence.placeId
    ) {
        robloxAdmins.push(user.get(presence.userId));
    }
}

for (const presence of data1.userPresences) {
    if (
        presence.userPresenceType === 2 &&
        presence.placeId !== TARGET_PLACE_ID &&
        presence.placeId
    ) {
        robloxAdmins.push(ic_rechte_user.get(presence.userId));
    }
}

// Unbekannt

for (const presence of data6.userPresences) {
    if (
        presence.userPresenceType === 2 &&
        !presence.placeId
    ) {
        unknownAdmins.push(user.get(presence.userId));
    }
}

for (const presence of data1.userPresences) {
    if (
        presence.userPresenceType === 2 &&
        !presence.placeId
    ) {
        unknownAdmins.push(ic_rechte_user.get(presence.userId));
    }
}


// Building List

function buildList(users) {
    if (!users || users.length === 0) {
        return "*Keine Benutzer gefunden*";
    }

    return users
        .filter(Boolean)
        .map(name => `- ${name}`)
        .join("\n");
}

const timestamp = Math.floor(Date.now() / 1000);
        
const text999 = data.features["online-list"]["formart"]
const real = text999
.replace("{ONLINE_MIT_RECHTEN}", buildList(ingameAdmins))
.replace("{ONLINE_OHNE_RECHTE}", buildList(ohneAdmins))
.replace("{ONLINE_ROBLOX}", buildList(robloxAdmins))
.replace("{UNBEKANNT}", buildList(unknownAdmins))
.replace("{TIMESTAMP}", `<t:${timestamp}:R>`);

const split = text999.split("\n");
        
const message = output(split[0], real, "Green")

for (const id of data.features["online-list"]["channels"]) {
    const channel = await client.channels.fetch(id)

    if (data.discord["use-container"]) {
            channel.send({ flags: 1 << 15, components: [message] });
    } else {
        channel.send({ embeds: [message] })
    }
}
}