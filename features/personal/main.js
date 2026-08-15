const db = require("../../utils/database.js")

async function generate(username) {
  var name = ""
  var geburt = ""
  var pkw = ""
  var lkw = ""
  var motorrad = ""
  var waffe_klein = ""
  var waffe_groß = ""

    await db.get(
    "SELECT * FROM perso WHERE username = ?",
    [username],
    async (err, row) => {
        if (err) {
            return console.log(`[Ausweis] Fehler: ${err}`)
        }
        if (!row) {
            return res.status(401).json({ "error": "auth" })
        }

        name = row.name
        geburt = row.geburt
        pkw = row.pkw
        lkw = row.lkw
        motorrad = row.motorrad
        waffe_klein = row.waffe_klein
        waffe_groß = row.waffe_groß
    }
    )

  const scheine = [];
  if (PKW) scheine.push("PKW");
  if (LKW) scheine.push("LKW");
  if (Motorrad) scheine.push("Motorrad");

  

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
    const base = await loadImage('./background.png');
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
    bild.font = 'bold 24px Arial';

    bild.fillText(`Name: ${name}`, 22, 125);
    bild.fillText(`Geburtsdatum: ${geburt}`, 22, 150);
    bild.fillText(`Führerscheine: ${scheine.join(", ") || "Keine"}`, 22, 220);
    bild.fillText(`Großer Waffenschein: ${waffe_groß ? "Ja" : "Nein"}`, 22, 245);
    bild.fillText(`Kleiner Waffenschein: ${waffe_klein ? "Ja" : "Nein"}`, 22, 270);
    bild.fillText(`Häuser Server 1: ${haus1 || "Keine"}`, 22, 310);
    bild.fillText(`Häuser Server 2: ${haus2 || "Keine"}`, 22, 340);

    const buffer = canvas.toBuffer('image/png');

    return {
      files: [{
        attachment: buffer,
        name: 'personalausweis.png'
      }]
    };
} catch (err) {
console.log(`[Ausweis] Fehler: ${err}`)
}

} // generate Handler ende

async function create(username, name, geburt) {
    
}

async function remove(username) {
    
}

async function edit(username, key, value) {
    
}