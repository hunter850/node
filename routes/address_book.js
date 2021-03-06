const express = require("express");
const db = require(__dirname + "/../modules/connect_db");

const router = express.Router(); // 建立 router 物件
const { toDateString } = require(__dirname + "/../modules/date_tools");
const moment = require('moment-timezone');
const upload = require(__dirname + '/../modules/upload_images')
const Joi = require("joi");

const getListHandler = async (req, res) => {
    let output = {
        perPage: 10,
        page: 1,
        totalRows: 0,
        totalPages: 0,
        code: 0,  // 辨識狀態
        error: '',
        query: {},
        rows: []
    };

    let page = +req.query.page || 1;

    let search = req.query.search || '';
    output.query.search = search;
    let beginDate = req.query.beginDate || '';
    output.query.beginDate = beginDate;
    let endDate = req.query.endDate || '';
    output.query.endDate = endDate;

    let where = ' WHERE 1 ';
    if (search) {
        where += ` AND name LIKE ${db.escape("%" + search + "%")} `;
    }
    if (beginDate) {
        const mo = moment(beginDate);
        if (mo.isValid()) {
            where += ` AND birthday >= '${mo.format('YYYY-MM-DD')}' `;
            output.query.beginDate = mo.format('YYYY-MM-DD');
        }
    }
    if (endDate) {
        const mo = moment(endDate);
        if (mo.isValid()) {
            where += ` AND birthday <= '${mo.format('YYYY-MM-DD')}' `;
            output.query.endDate = mo.format('YYYY-MM-DD');
        }
    }

    if (page < 1) {
        output.code = 410;
        output.error = '頁碼太小';
        return output;
    }

    const sql01 = `SELECT COUNT(1) totalRows FROM address_book ${where} `;
    const [[{ totalRows }]] = await db.query(sql01);
    let totalPages = 0;
    if (totalRows) {
        totalPages = Math.ceil(totalRows / output.perPage);
        if (page > totalPages) {
            output.totalPages = totalPages;
            output.code = 420;
            output.error = '頁碼太大';
            return output;
        }

        const sql02 = `SELECT * FROM address_book ${where} ORDER BY sid DESC LIMIT ${(page - 1) * output.perPage}, ${output.perPage}`;
        const [r2] = await db.query(sql02);
        r2.forEach(el => el.birthday = toDateString(el.birthday));
        output.rows = r2;
    }
    output.code = 200;
    output = { ...output, page, totalRows, totalPages };

    output.showSql = where;
    return output;
}

router.get("/add", async (req, res) => {
    if(! req.session.admin){
        return res.redirect('/');
    }
    res.render('address_book/add');
});
router.post("/add", upload.none(), async (req, res) => {
    if(! req.session.admin){
        return res.json({success: false, error: '請先登入'});
    }
    const schema = Joi.object({
        name: Joi.string()
            .min(2)
            .max(20)
            .required()
            .messages({"string.empty": "姓名必填"}),
        email: Joi.string()
            .email(),
        mobile: Joi.string()
            .pattern(/^[0-9]{10}$/),
        birthday: Joi.string(),
        address: Joi.string(),
    });
    // const r = schema.validate(req.body, { abortEarly: false });
    // if(r.error) {
    //     r.error.details.forEach(item => {
    //         console.log(item.message);
    //     })
    // }
    // const {name, email, mobile, birthday, address} = req.body;
    // const sql = "INSERT INTO `address_book`(`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?,?,?,?,?,NOW())";
    // const [result] = await db.query(sql, [name, email, mobile, birthday, address]);
    res.json(schema.validate(req.body, { abortEarly: false }));
    // res.json(result);
});
router.get("/", async (req, res) => {
    const output = await getListHandler(req, res);
    switch (output.code) {
        case 410:
            return res.redirect(`?page=1`);
            break;
        case 420:
            return res.redirect(`?page=${output.totalPages}`);
            break;
    }
    if(! req.session.admin){
        res.render('address_book/main_noadmin', output);
    } else {
        res.render('address_book/main', output);
    }
});
router.get('/api', async (req, res) => {
    const output = await getListHandler(req, res);
    output.payload = res.locals.payload;
    res.json(output);
});
router.get('/api-auth', async (req, res) => {
    let output = {
        success: false,
        error: ''
    };
    if(res.locals.loginUser && res.locals.loginUser.account){
        output = {...(await getListHandler(req, res)), success: true};

    } else {
        output.error = '沒有授權';
    }
    output.loginUser = res.locals.loginUser;
    res.json(output);
    // const output = await getListHandler(req, res);
    // output.payload = res.locals.payload;
    // res.json(output);
});
module.exports = router;