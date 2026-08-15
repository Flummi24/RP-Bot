const data = require("../../data/data.json")
const GAME_ID = data.features["online-list"]["game-id"]
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
