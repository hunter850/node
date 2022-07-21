const db = require(__dirname + "/../modules/connect_db.js");

const bcrypt = require("bcryptjs");

const sql = "INSERT INTO `admins`(`account`, `pass_hash`, `create_at`) VALUES (?, ?, NOW())";

(async ()=>{
    var hash = await bcrypt.hash("123456", 10);

    const r = await db.query(sql, ["hunter", hash]);
    console.log(r);
    process.exit();
})();