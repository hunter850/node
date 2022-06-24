require("dotenv").config();
const express = require("express");
const app = express();

const { PORT } = process.env;
//middleware 中介軟體 幫忙預先處理送進來的request
const bodyParser = express.urlencoded({extended: false});

app.set("view engine", "ejs");


app.get("/", (req, res) => {
    res.render("main", {name: "Ming"});
});


//去http://localhost:3300/try_qs?a=10&b=20 看會回傳一包物件 a[]=10 a會是陣列 a[命名] a會是物件
app.get("/try_qs", (req, res) => {
    res.json(req.query);
});

//用postman http://localhost:3300/try_post 選x-www-form-urlencoded 輸入key value 就能看到回傳
app.post("/try_post", bodyParser, (req, res) => {
    res.json(req.body);
});

// ------------static folder----------------
app.use(express.static("public"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));
// -----------------404---------------------
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

