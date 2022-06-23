require("dotenv").config();
const express = require("express");
const app = express();

const { PORT } = process.env;

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));

app.get("/", (req, res) => {
    res.render("main", {name: "Ming"});
});

app.use((req, res) => {
    res.send(`
        <div style="width: 640px; height: 360px">
            <img src="/imgs/6M513.png" alt="404_not_found" style="width: 100%; height: 100%; object-fit: cover " />
        </div>
    `);
});

app.listen(PORT, () => {
    console.log(`server started: http://localhost:${PORT}`);
})

