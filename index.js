require("dotenv").config();
const express = require("express");
const app = express();

const { PORT } = process.env;

app.get("/", (req, res) => {
    // res.end(`<h2>Hello Express</h2>`);
    res.send(`<h2>Hello Express</h2>`);
});

app.listen(PORT, () => {
    console.log(`server started: http://localhost:${PORT}`);
})

