const http = require("http");
const fs = require("fs")

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/html; charset=utf8;"
    })
    fs.writeFile(
        __dirname + "/../data/header01.txt",
        JSON.stringify(req.headers),
        (error) => {
            if(error) {
                console.log(error);
                res.end("發生錯誤");
            } else {
                res.end("完成寫入")
            }
        }
    )
})

console.log("open server: http://localhost:3300")

server.listen(3300);