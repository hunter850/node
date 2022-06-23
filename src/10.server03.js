const http = require("http");
const fs = require("fs/promises")

const server = http.createServer(async (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/html; charset=utf8;"
    })
    try {
        await fs.writeFile(
            __dirname + "/../data/header01.txt",
            JSON.stringify(req.headers)
        )
        res.end("完成寫入server03")
    } catch(ex) {
        console.log(ex);
        res.end("寫入失敗")
    }
})

console.log("open server: http://localhost:3300")

server.listen(3300);