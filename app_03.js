const http = require('http');

const server = http.createServer( (req, res) => {
    const url = req.url;
    const method = req.method;
    console.log(`HTTP request received: url=${url} , method=${method}`)


    if(url === '/'){
        res.write(`
        <html>
        <head>
        <title>
        MemoApp
        </title>
        </head>
        <body>
            <form action="add-note" method="POST">
                <input type="text" name="note">
                <button type="submit">Add note</button>
            </form>
        </body>
        </html>`);
        res.end();
    }
})

server.listen(8080);