const db = require(__dirname + '/../modules/mysql-connect');


class AddressBook {
    static tableName = 'address_book';
    data = {};
    // CRUD
    constructor({sid, name, email, mobile, birthday, address, created_at}){
        this.data = {sid, name, email, mobile, birthday, address, created_at};
    }
    async save(){
        // 如果有 sid 為修改資料, 如果沒有為新增資料
    }
    async remove(){}

    static async find(params){}
    static async findOne(id){
        const sql = `SELECT * FROM ${AddressBook.tableName} WHERE sid=?`;

        const [rows] = await db.query(sql, [id]);
        if(rows.length){
            return new AddressBook(rows[0]);  // AddressBook 個體
        } else {
            return null;
        }
    }


}

/*
const a1 = await AddressBook.findOne(15);
a1.data.mobile = '0918345678';
await a1.save();

const a2 = new AddressBook({...})
await a2.save();
*/


