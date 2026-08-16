async function roblox(username) {
    const res = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [username] })
    });

    const data = await res.json();
    if (!data.data || data.data.length === 0) {
      return false
    } else {
        return true
    }
}

module.exports = roblox