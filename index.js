require("dotenv").config();
const express = require("express");
const app = express();
// const multer  = require('multer');
const upload = require(__dirname + "/modules/upload_images");
const session = require('express-session');
const moment = require('moment-timezone');
const db = require(__dirname + '/modules/connect_db');
const MysqlStore = require('express-mysql-session')(session);
const sessionStore = new MysqlStore({}, db);
const axios = require("axios");
const bcrypt = require("bcryptjs");
const cors = require('cors')

const {
    toDateString,
    toDateTimeString
} = require(__dirname + "/modules/date_tools");

//去node console看看
// const bcrypt = require("bcryptjs");
//const hash = bcrypt.hashSync(密碼);
//console.log(bcrypt.compareSync(a))


const { PORT, SECRET } = process.env;
//middleware 中介軟體 幫忙預先處理送進來的request
// const bodyParser = express.urlencoded({extended: false});
//-------------Top-levet middleware--------------
/*
const cors = require('cors');
var whitelist = ['http://localhost:8080', undefined, 'http://localhost:3000'];
var corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        console.log('origin: ' + origin);
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
};
app.use(cors(corsOptions));
*/
const corsOptions = {
    credentials: true,
    origin: (origin, cb) => {
        console.log({ origin });
        cb(null, true);
    }
};
app.use(cors(corsOptions));

app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: SECRET,
    store: sessionStore,
    cookie: {
        maxAge: 1800000
    }
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//middleware不執行next就會斷在這裡 後面的都不會跑
// app.use((req, res, next) => {
//     res.locals.shinder = '哈囉';
//     next();
// })
app.use((req, res, next) => {
    res.locals.toDateString = toDateString;
    res.locals.toDateString = toDateTimeString;
    res.locals.session = req.session;

    next();
});

//-------------設定ejs作為模板---------------
app.set("view engine", "ejs");
//--------------網址區分大小寫-----------------
// app.set("case sensitive routing", true);

//-----------------route--------------------
app.get("/", (req, res) => {
    res.render("main", { name: "Ming" });
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
    .get((req, res) => {
        res.render('try_post_form');
    })
    .post((req, res) => {
        const { account, password } = req.body;
        res.render('try_post_form', { account, password });
    });

//singe只能上傳單欄單檔
app.post('/try_upload', upload.single('avatar'), (req, res) => {
    res.json(req.file);
});
//array能單欄上傳多檔案
app.post('/try_uploads', upload.array('photos'), (req, res) => {
    res.json(req.files);
});

//:代表藥用params ?為選擇性 可傳可不傳
app.get('/try_params/:action?/:id?', (req, res) => {
    res.json(req.params);
});

//regexp 只要符合regexp判斷的就會進入
app.get(/^\/hi\/?/i, (req, res) => {
    res.json({ url: req.url });
});

//陣列 符合陣列的都會進入
app.get(["/aaa", "/bbb"], (req, res) => {
    res.json({ url: req.url, name: "Array" });
});

app.get('/try_session', (req, res) => {
    req.session.my_var = req.session.my_var || 0;
    req.session.my_var++;
    res.json({
        my_var: req.session.my_var,
        session: req.session,
    });
})

app.get("/try_json", (req, res) => {
    const data = require(__dirname + "/data/data01");
    console.log(data);
    res.locals.rawData = data;
    res.render("try_json");
});

app.get('/yahoo', async (req, res) => {
    axios.get('https://tw.yahoo.com/')
        .then(response => {
            // handle success
            // console.log(response);
            res.send(response.data);
        })
});

app.route('/login')
    .get(async (req, res) => {
        res.render('login');
    })
    .post(async (req, res) => {

        const { account, password } = req.body;

        const output = {
            success: false,
            error: "",
            code: 0
        }

        const sql = "SELECT * FROM admins WHERE account = ?";
        const [r1] = await db.query(sql, [account]);

        if (r1.length !== 1) {
            output.code = 401;
            output.error = "帳密錯誤"
            return res.json(output);
        }

        output.success = await bcrypt.compare(password, r1[0].pass_hash);
        if (!output.success) {
            output.code = 402;
            output.error = "帳密錯誤"
        } else {
            req.session.admin = {
                sid: r1[0].sid,
                account: r1[0].account,
            };
        }

        res.json(output)
    });

app.get("/logout", (req, res) => {
    delete req.session.admin;

    res.redirect("/");
});
app.get("/try_moment", (req, res) => {
    const fm = "YYYY-MM-DD HH:mm:ss";
    const nowTime = moment();
    const createTime = moment("2022-02-28");

    res.json({
        nowTime: nowTime.format(fm),
        nowTimeLondon: nowTime.tz("Europe/London").format(fm),
        createTime: createTime.format(fm),
        createTimeLondon: createTime.tz("Europe/London").format(fm)
    })
});


app.use("/address_book", require(__dirname + "/routes/address_book"))

//-----------------router--------------------
// app.use("/admins", require(__dirname + "/routes/admins"))
//這樣就會/admins和/都能進入
const adminRouter = require(__dirname + "/routes/admins");
const cartsRouter = require(__dirname + "/routes/carts");
app.use("/admins", adminRouter);
app.use("/carts", cartsRouter);
app.use(adminRouter);
app.use(cartsRouter);


// ------------static folder----------------
app.use(express.static("public"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));
app.use("/joi", express.static("node_modules/joi/dist"));
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

