const express = require("express")
const data = require("../../data/data.json")
const db = require("../../utils/database.js")

const api = express();
api.use(express.json());
app.use(express.static(path.join(__dirname, "src")));


api.post("/api/sql", async (req, res) => {
    return;
});

api.post("/api/login", async (req, res) => {
    return;
});


api.listen(data["http-server"].port, () => {});