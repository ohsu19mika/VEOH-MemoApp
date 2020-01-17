const http = require('http');
const fs = require('fs');

const notes = [];

const server = http.createServer( (req, res) => {
    const url = req.url;
    const method = req.method;
    console.log(`HTTP request received: url=${url} , method=${method}`)


    if(url === '/'){
        res.write(`
        <html>
        <head>
        <title>MemoApp</title>
        <meta http-equiv="Content-Type", content="text/html;charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="style.css">
        </head>
        <body>`);

        notes.forEach( (value, index) => {
            res.write(`
            <div>${value}
            <form action="delete-note" method="POST">
                <input type="hidden" name="index" value="${index}">
                <button type="submit" class="delete_button">Delete</button>
            </form>
            </div>`);
        });

        res.write(`<form action="add-note" method="POST">
                <input type="text" name="note" autofocus="true">
                <button type="submit" class="add_button">Add note</button>
            </form>
        </body>
        </html>`);
        res.statusCode = 200; //OK
        res.end();
        return;
    }
    else if(url === '/add-note'){
        //console.log('/add-note')

        const chunks = [];
        req.on('data', (chunk)=>{
            chunks.push(chunk);
        });

        req.on('end', ()=>{
            //console.log(chunks);
            const body = Buffer.concat(chunks).toString();
            const decoded_body = decodeURIComponent(body);
            const note = decoded_body.split('=')[1];
            notes.push(note);
            //console.log(decoded_body);
            res.statusCode = 303; //Redirect
            res.setHeader('Location', '/');
            res.end();
        });
        return;
    }
    else if(url === '/delete-note'){
        //console.log('/delete-note')

        const chunks = [];
        req.on('data', (chunk)=>{
            chunks.push(chunk);
        });

        req.on('end', ()=>{
            //console.log(chunks);
            const body = Buffer.concat(chunks).toString();
            const index = body.split('=')[1];
            if (index != "" && index != null){
                notes.splice(index,1);
            }            
            //console.log(body);
            res.statusCode = 303; //Redirect
            res.setHeader('Location', '/');
            res.end();
        });
        return;
    }
    else if(url === '/favicon.ico'){
        fs.readFile('./favicon.ico', (err, data) => {
            if (err != null){
                res.statusCode = 404; //Not found
                res.end();
            }
            else{
                res.write(data);
                res.end();
            }
        });
        return;
    }
    else if(url === '/style.css'){
        fs.readFile('./style.css', (err, data) => {
            if (err != null){
                res.statusCode = 404; //Not found
                res.end();
            }
            else{
                res.write(data);
                res.end();
            }
        });
        return;
    }

    
    console.log(`${url} not found`);
    res.write(`
    <html>
    <head>
    <title>
    MemoApp - 404
    </title>
    </head>
    <body>
        <h1>404 - page not found</h1>
    </body>
    </html>`);
    res.statusCode = 404; //Not found
    res.end();
})

server.listen(8080);