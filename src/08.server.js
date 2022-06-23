const http = require("http");

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    res.end(`
        <h2>Hello Node</h2>
        <p>${req.url}</p>
    `);
})

console.log("open server: http://localhost:3300")

server.listen(3300);