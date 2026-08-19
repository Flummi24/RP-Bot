const db = require("../../utils/database.js")
const { createCanvas, loadImage } = require("canvas");
const crypto = require("crypto")
const path = require("path");

function hat(username) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT username FROM perso WHERE username = ?",
            [username],
            (err, row) => {
                if (err) {
                    return reject(err);
                }

                resolve(!!row);
            }
        );
    });
}


function infos(username) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT * FROM perso WHERE username = ?",
            [username],
            (err, row) => {
                if (err) {
                  return reject(err);
                }
                resolve(row);
            }
        );
    });
}

function getall() {
    return new Promise((resolve, reject) => {
        db.all(
            "SELECT * FROM perso",
            [],
            (err, rows) => {
                if (err) {
                    return reject(err);
                }

                resolve(rows);
            }
        );
    });
}

async function generate(username) {

const row = await infos(username);

  if (!row) {
    console.log(`[Ausweis] User nicht gefunden: ${username}`);
    return false
  }

  const name = row.name;
const geburt = row.geburt;

const pkw = row.pkw === "true";
const lkw = row.lkw === "true";
const motorrad = row.motorrad === "true";

const waffe_klein = row.waffe_klein === "true";
const waffe_groß = row.waffe_groß === "true";

let haeuser = [];

try {
    haeuser = JSON.parse(row.haeuser || "[]");

    if (!Array.isArray(haeuser)) {
        haeuser = [];
    }
} catch {
    haeuser = [];
}

const scheine = [];

if (pkw) scheine.push("PKW");
if (lkw) scheine.push("LKW");
if (motorrad) scheine.push("Motorrad");

const waffenscheine = [];

if (waffe_klein) waffenscheine.push("Klein");
if (waffe_groß) waffenscheine.push("Groß");

  

  try {

    const idRes = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [username] })
    });

    const idData = await idRes.json();
    if (!idData.data || idData.data.length === 0) {
      return "Roblox Username nicht Gefunden"
    }

    const userId = idData.data[0].id;

    
    const thumbRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=180x180&format=Png&isCircular=false`);
    const thumbData = await thumbRes.json();

    const avatarUrl = thumbData.data[0].imageUrl;
          

    // Canvas starten
    const base = await loadImage(path.join(__dirname, "./background.png"));
    const canvas = createCanvas(base.width, base.height);
    const bild = canvas.getContext('2d');

    bild.drawImage(base, 0, 0);

    // Avatar
    const avatar = await loadImage(avatarUrl);

    const avatarWidth = 240;
    const avatarHeight = 250;
    const padding = 20;

    const x = base.width - avatarWidth - padding;
    const y = (base.height - avatarHeight) / 2 + 5;

    bild.drawImage(avatar, x, y, avatarWidth, avatarHeight);

    // Titel
    bild.fillStyle = '#111111';
    bild.font = 'bold 45px Arial';
    bild.fillText('Personalausweis', 18, 60);

    // Daten
    bild.font = 'bold 30px Arial';

    bild.fillText(`Name: ${name}`, 22, 125);
    bild.fillText(`Geburtsdatum: ${geburt}`, 22, 160);
    bild.fillText(`Führerscheine: ${scheine.join(", ") || "Keine"}`, 22, 220);
    bild.fillText(`Großer Waffenschein: ${waffe_groß ? "Ja" : "Nein"}`, 22, 255);
    bild.fillText(`Kleiner Waffenschein: ${waffe_klein ? "Ja" : "Nein"}`, 22, 290);

    const buffer = canvas.toBuffer('image/png');

    return {
      files: [{
        attachment: buffer,
        name: 'personalausweis.png'
      }]
    };
} catch (err) {
console.log(`[Ausweis] Fehler: ${err}`)
return false
}

} // generate Handler ende

function add(username, name, geburt) {
    return new Promise((resolve) => {
        db.run(
            `INSERT INTO perso 
            (username, name, geburt, pkw, lkw, motorrad, waffe_klein, waffe_groß, haeuser) 
            VALUES (?, ?, ?, 'false', 'false', 'false', 'false', 'false', '')`,
            [username, name, geburt],
            function (err) {
                if (err) {
                    console.log(`[Ausweis] Fehler: ${err}`);
                    resolve(false);
                    return;
                }

                resolve(true);
            }
        );
    });
}


async function create(username, name, geburt) {

  const ok = await add(username.toLowerCase(), name, geburt)

  return ok
}

function remove_func(username) {
    return new Promise((resolve) => {
        db.run(
            "DELETE FROM perso WHERE username = ?",
            [username],
            function (err) {
                if (err) {
                    console.log(`[Ausweis] Fehler: ${err}`);
                    resolve(false);
                    return;
                }

                resolve(this.changes > 0);
            }
        );
    });
}


async function remove(username) {

  const ok = await remove_func(username)

  return ok
}

function edit_func(username, key, value) {
    return new Promise((resolve) => {
        db.run(
            `UPDATE perso SET "${key}" = ? WHERE username = ?`,
            [value, username],
            function (err) {
                if (err) {
                    console.log(`[Ausweis] Fehler: ${err}`);
                    resolve(false);
                    return false;
                }

                resolve(this.changes > 0);
            }
        );
    });
}

async function edit(username, key, value) {
    const ok = await edit_func(username, key, value);

    return ok;
}


module.exports = {
  'generate': generate,
  'create': create,
  'remove': remove,
  'edit': edit,
  'info': infos,
  'hat': hat,
  'getall': getall
}