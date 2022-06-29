const express = require("express");
const db = require(__dirname + "/../modules/connect_db");

const router = express.Router(); // 建立 router 物件
const { toDateString } = require(__dirname + "/../modules/date_tools");

router.get("/", async (req, res) => {
    let output = {
        perPage: 10,
        page: 1,
        totalRows: 0,
        totalPages: 0,
        rows: []
    }

    let page = req.query.page || 1;
    if (page < 1) return res.redirect("?page=1");

    const sql = "SELECT COUNT(1) totalRows FROM address_book";
    const [[{ totalRows }]] = await db.query(sql);

    let totalPages = 0;
    if (totalRows) {
        totalPages = Math.ceil(totalRows / output.perPage);
        if (page > totalPages) return res.redirect(`?page=${totalPages}`);

        const sql2 = `SELECT * FROM address_book LIMIT ${(page - 1) * output.perPage}, ${output.perPage}`;
        const [result] = await db.query(sql2);
        result.forEach(el => el.birthday = toDateString(el.birthday));
        output.rows = result;
    }

    output = { ...output, page, totalPages, totalRows }
    res.render("address_book/main", output);
})
module.exports = router;