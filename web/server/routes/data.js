api.get("/api/data", async (req, res) => {

    const auth = req.query.auth;

    if (!auth) {
        return res.status(401).json({
            error: "auth"
        });
    }

    db.get(
        "SELECT * FROM users WHERE token = ?",
        [auth],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    error: "500"
                });
            }

            if (!row) {
                return res.status(401).json({
                    error: "auth"
                });
            }

            const memory = process.memoryUsage();
            const cpu = process.cpuUsage();

            return res.status(200).json({
                success: true,

                node: {
                    version: process.version,
                    pid: process.pid,
                    uptime: process.uptime()
                },

                cpu: {
                    user: cpu.user,
                    system: cpu.system
                },

                memory: {
                    rss: memory.rss,
                    heapTotal: memory.heapTotal,
                    heapUsed: memory.heapUsed,
                    external: memory.external,
                    arrayBuffers: memory.arrayBuffers
                },

                memoryMB: {
                    rss: +(memory.rss / 1024 / 1024).toFixed(2),
                    heapTotal: +(memory.heapTotal / 1024 / 1024).toFixed(2),
                    heapUsed: +(memory.heapUsed / 1024 / 1024).toFixed(2),
                    external: +(memory.external / 1024 / 1024).toFixed(2),
                    arrayBuffers: +(memory.arrayBuffers / 1024 / 1024).toFixed(2)
                }
            });
        }
    );
});