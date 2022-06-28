const db = require(__dirname + "/../modules/connect_db");

(async () => {
    const sql = "SELECT * FROM address_book LIMIT 5";
    const [result] = await db.query(sql);

    console.log(result);
    process.exit();
})();