require("dotenv").config();
const express = require("express");
const app = express();
// const multer  = require('multer');
const upload = require(__dirname + "/modules/upload_images");

const { PORT } = process.env;
//middleware 中介軟體 幫忙預先處理送進來的request
// const bodyParser = express.urlencoded({extended: false});
//-------------Top-levet middleware--------------
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//middleware不執行next就會斷在這裡 後面的都不會跑
// app.use((req, res, next) => {
//     res.locals.shinder = '哈囉';
//     next();
// })

//-------------設定ejs作為模板---------------
app.set("view engine", "ejs");
//--------------網址區分大小寫-----------------
// app.set("case sensitive routing", true);

//-----------------route--------------------
app.get("/", (req, res) => {
    res.render("main", {name: "Ming"});
});

//去http://localhost:3300/try_qs?a=10&b=20 看會回傳一包物件 a[]=10 a會是陣列 a[命名] a會是物件
app.get("/try_qs", (req, res) => {
    res.json(req.query);
});

//用postman http://localhost:3300/try_post 選x-www-form-urlencoded 輸入key value 就能看到回傳
// app.post("/try_post", bodyParser, (req, res) => {
//     res.json(req.body);
// });
app.post("/try_post", (req, res) => {
    res.json(req.body);
});

//小心因為到/try-post-form這個頁面會先跑post 如果ejs裡有擺變數 會抓到undefined噴錯 所以ejs template裡面要寫三元運算判斷若undefined 要輸出 ""
app.route('/try_post_form')
    .get((req, res)=>{
        res.render('try_post_form');
    })
    .post((req, res)=>{
        const {account, password} = req.body;
        res.render('try_post_form', {account, password});
    });

//singe只能上傳單欄單檔
app.post('/try_upload', upload.single('avatar'), (req, res)=>{
    res.json(req.file);
});
//array能單欄上傳多檔案
app.post('/try_uploads', upload.array('photos'), (req, res)=>{
    res.json(req.files);
});

//:代表藥用params ?為選擇性 可傳可不傳
app.get('/try_params/:action?/:id?', (req, res)=>{
    res.json(req.params);
});

//regexp 只要符合regexp判斷的就會進入
app.get(/^\/hi\/?/i, (req, res)=>{
    res.json({url: req.url});
});

//陣列 符合陣列的都會進入
app.get(["/aaa", "/bbb"], (req, res)=>{
    res.json({url: req.url, name: "Array"});
});

//-----------------router--------------------
// app.use("/admins", require(__dirname + "/routes/admins"))
//這樣就會/admins和/都能進入
const adminRouter = require(__dirname + "/routes/admins");
app.use("/admins", adminRouter);
app.use(adminRouter);


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

