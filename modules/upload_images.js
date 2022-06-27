const multer = require('multer');
const { v4 } = require("uuid");

const extMap = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
}

//cb第一個參數先設為null 第二個參數true為接收讓該檔案 false為不接收 用上面extMap的dictionary來決定只接收那些檔案
function fileFilter(req, file, cb) {
    cb(null, extMap[file.mimetype]);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + "/../public/imgs");
    },
    filename: function (req, file, cb) {
        const filename = v4() + extMap[file.mimetype];
        cb(null, filename);
    }
})

module.exports = multer({ fileFilter, storage });